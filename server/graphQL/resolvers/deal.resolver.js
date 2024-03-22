const Deal = require("../../models/deal.model");
const { v4: uuidv4 } = require("uuid");
const moment = require("moment");
const cron = require("node-cron");
const pubsub = require("../pubsub");

// const { PubSub } = require("graphql-subscriptions");
// const pubsub = new PubSub();

const dealResolvers = {
	Query: {
		hello: async () => {
			return "hello world";
		},

		getAllDeals: async () => {
			return await Deal.find()
				.populate("client_id")
				.then((deals) => {
					console.log(
						"all the deals",
						deals,
						"\n____________________"
					);
					return deals;
				})
				.catch((err) => {
					console.log(
						"there was an error fetching all the deals",
						err,
						"\n____________________"
					);
					throw err;
				}); //gets all the vehicles(items) in the data base
		},

		getOneDeal: async (_, { id }) => {
			return await Deal.findById(id)
				.populate("client_id")
				.then((deal) => {
					console.log("one deal ", deal, "\n____________________");
					return deal;
				})
				.catch((err) => {
					console.log(
						"there was an error fetching one deal",
						err,
						"\n____________________"
					);
					throw err;
				}); //gets one the vehicle(item) from the data base
		},
	},

	Mutation: {
		createOneDeal: async (
			_,
			{
				dayOfDeal,
				downPayment,
				payment,
				paymentDates,
				remainingBalance,
				sellingPrice,
				carName,
				carModel,
				carColor,
				carYear,
				client_id,
			}
		) => {
			const create = {
				dayOfDeal,
				downPayment,
				payment,
				remainingBalance,
				sellingPrice,
				carName,
				carModel,
				client_id,
			};

			paymentDates = paymentDates.map((paymentDate) => {
				return {
					...paymentDate,
					payment_id: uuidv4(), // Generates a unique UUID
				};
			});
			const createdAt = new Date().toISOString(); // Use toISOString() for custom DateTime scalar
			const updatedAt = new Date().toISOString(); // Use toISOString() for custom DateTime scalar
			//Date;
			create.createdAt = createdAt;
			create.updatedAt = updatedAt;
			create.paymentDates = paymentDates;

			if (carColor !== undefined) {
				create.carColor = carColor;
			}

			if (carYear !== undefined) {
				create.carYear = carYear;
			}

			return await Deal.create(create)
				.then(async (newDeal) => {
					console.log(
						"new deal created",
						newDeal,
						"\n____________________"
					);
					pubsub.publish("DEAL_ADDED", {
						onDealChange: {
							eventType: "DEAL_ADDED",
							dealChanges: newDeal,
						},
					});
					// Use the getOneDeal method to fetch and populate the new deal
					return await dealResolvers.Query.getOneDeal(null, {
						id: newDeal.id,
					});
				})
				.catch((err) => {
					console.log(
						"there was an error creating a new Deal",
						err,
						"\n____________________"
					);
					throw err;
				});
		},

		updateOneDeal: async (parent, args, context, info) => {
			const {
				id,
				downPayment,
				payment,
				remainingBalance,
				sellingPrice,
				carName,
				carModel,
				carColor,
				carYear,
			} = args;
			const update = { updatedAt: new Date().toISOString() }; // Use toISOString() for custom DateTime

			if (downPayment !== undefined) {
				update.downPayment = downPayment;
			}
			if (payment !== undefined) {
				update.payment = payment;
			}
			if (remainingBalance !== undefined) {
				update.remainingBalance = remainingBalance;
			}
			if (sellingPrice !== undefined) {
				update.sellingPrice = sellingPrice;
			}
			if (carName !== undefined) {
				update.carName = carName;
			}
			if (carModel !== undefined) {
				update.carModel = carModel;
			}
			if (carColor !== undefined) {
				update.carColor = carColor;
			}
			if (carYear !== undefined) {
				update.carYear = carYear;
			}

			return await Deal.findByIdAndUpdate(id, update, {
				new: true,
			})
				.then(async (updatedDeal) => {
					console.log(
						"deal updated",
						updatedDeal,
						"\n____________________"
					);
					return await dealResolvers.Query.getOneDeal(null, {
						id: updatedDeal.id,
					});
				})
				.catch((err) => {
					console.log(
						"there was an error updating a deal",
						err,
						"\n____________________"
					);
					throw err;
				});
		},

		updateOneDealPayment: async (
			parent,
			{ id, selectedPayments, amountPayed },
			context,
			info
		) => {
			const update = { updatedAt: new Date().toISOString() }; // Use toISOString() for custom DateTime

			if (selectedPayments !== undefined && selectedPayments.length > 0) {
				console.log("the selectedPayments hit");
				const bulkOps = [];
				for (payment of selectedPayments) {
					bulkOps.push({
						updateOne: {
							filter: {
								_id: id,
								"paymentDates.payment_id": payment.payment_id,
							},
							update: {
								$set: {
									"paymentDates.$.monthFullyPay": true,
									"paymentDates.$.amountPayedThisMonth":
										payment.hasToPay,
									// "paymentDates.$.remainingBalance":payment.remainingBalance -payment.hasToPay,
									"paymentDates.$.hasToPay":
										payment.hasToPay - payment.hasToPay,
								},
							},
						},
					});
				}
				console.log("after the loop");

				if (bulkOps.length > 0) {
					await Deal.bulkWrite(bulkOps);
				}
			}

			if (amountPayed !== undefined) {
				const bulkOps = [];
				let remainingAmount = amountPayed.amount;

				for (const payment of amountPayed.paymentDates) {
					if (remainingAmount <= 0) {
						console.log("breaking the loop");
						break;
					}
					// Calculate the amount to be paid for this payment
					const paymentAmount = Math.min(
						remainingAmount,
						payment.hasToPay
					);

					bulkOps.push({
						updateOne: {
							filter: {
								_id: id,
								"paymentDates.payment_id": payment.payment_id,
							},
							update: {
								$set: {
									"paymentDates.$.monthFullyPay":
										paymentAmount >= payment.hasToPay, // Check if the payment is fully paid
									"paymentDates.$.amountPayedThisMonth":
										paymentAmount,
									"paymentDates.$.hasToPay":
										payment.hasToPay - paymentAmount,
								},
							},
						},
					});
					remainingAmount -= paymentAmount;
				}
				console.log("after the loop");

				if (bulkOps.length > 0) {
					await Deal.bulkWrite(bulkOps);
				}
			}

			return await Deal.findOneAndUpdate(
				{ _id: id },
				update,
				{ new: true } // Return the updated document
			)
				.then(async (updatedDeal) => {
					pubsub.publish("DEAL_UPDATED", {
						onDealChange: {
							eventType: "DEAL_UPDATED",
							dealChanges: updatedDeal,
						},
					});

					// console.log(
					// 	"deal updated",
					// 	updatedDeal,
					// 	"\n____________________"
					// );
					return await dealResolvers.Query.getOneDeal(null, {
						id: updatedDeal.id,
					});
				})
				.catch((err) => {
					console.log(
						"there was an error updating a deal payment",
						err,
						"\n____________________"
					);
					throw err;
				});
		},

		deleteOneDeal: async (_, { id }) => {
			return await Deal.findByIdAndDelete(id)
				.then(async (deletedDeal) => {
					pubsub.publish("DEAL_DELETED", {
						onDealChange: {
							eventType: "DEAL_DELETED",
							dealChanges: deletedDeal,
						},
					});

					console.log(
						" a deal was deleted",
						deletedDeal,
						"\n____________________"
					);
					return true;
				})
				.catch((err) => {
					console.log(
						"there was an error deleting a deal",
						err,
						"\n____________________"
					);
					throw err;
				});
		},

		// !!!!! fix the function so that i can handle multiple days  late you can make use of a if that checks if the isLate field is set to true so you can add a multiplier base on how many days the payment is late you might want to the nested else if //todo   and you might want to add a new field on the paymentDates  to lattestUpdate and the update is going to be the latest date that it was updated  so you so you have to make use of the  deals updated at
		// isDealPaymentPayed: async (parent, args, context, info) => {
		// 	// Retrieve all deals using a query function 'getAllDeals'.
		// 	const allDeals = await dealResolvers?.Query?.getAllDeals();

		// 	// Get the current date using moment.js.
		// 	const today = moment();

		// 	// Iterate over each deal in the list of all deals.
		// 	for (const deal of allDeals) {
		// 		let dealUpdated = false; // Flag to track if the deal has been updated.
		// 		const lastUpdate = moment(deal.updatedAt); // Get the last update time of the deal.
		// 		const daysSinceLastUpdate = today.diff(lastUpdate, "days"); // Calculate days since the last update.

		// 		// Check if at least one day has passed since the last update.
		// 		if (daysSinceLastUpdate >= 1) {
		// 			// Iterate over each payment information in the deal.
		// 			for (const paymentInfo of deal.paymentDates) {
		// 				const paymentDueDate = moment(
		// 					paymentInfo.dateOfPayment
		// 				); // Get the due date for the payment.
		// 				const daysLate = today.diff(paymentDueDate, "days"); // Calculate how many days late the payment is.

		// 				let firstCheck = false; // Flag to indicate if it's the first check for lateness.

		// 				// Check if the payment is late.
		// 				if (daysLate > 0) {
		// 					// If the payment is not already marked as late, add a late fee of $80 and set the flag to true.
		// 					if (!paymentInfo.isLate) {
		// 						paymentInfo.latenessFee = 80;
		// 						paymentInfo.isLate = true;
		// 						firstCheck = true;
		// 					}
		// 					// If it's the first time marking as late and within 45 days, add $10 fee for each day late except the first day.
		// 					if (daysLate <= 45 && firstCheck) {
		// 						paymentInfo.latenessFee += 10 * (daysLate - 1);
		// 					}

		// 					// If it's not the first check and the payment is within 45 days late, add $10 fee for each day late.
		// 					if (daysLate <= 45 && firstCheck === false) {
		// 						paymentInfo.latenessFee += 10 * daysLate;
		// 					}
		// 					// Cap the lateness fee at a maximum value.
		// 					paymentInfo.latenessFee = Math.min(
		// 						paymentInfo.latenessFee,
		// 						80 + 10 * 44
		// 					);
		// 					paymentInfo.daysLate = daysLate; // Update the number of days late.
		// 					dealUpdated = true; // Mark the deal as updated.
		// 				}

		// 				// If the deal was updated, save the changes to the database.
		// 				if (dealUpdated) {
		// 					console.log("doing the update");
		// 					await Deal.updateOne(
		// 						{
		// 							id: deal.id,
		// 							"paymentDates.payment_id":
		// 								paymentInfo.payment_id,
		// 						},
		// 						{
		// 							"paymentDates.$.isLate": paymentInfo.isLate,
		// 							"paymentDates.$.latenessFee":
		// 								paymentInfo.latenessFee,
		// 							"paymentDates.$.daysLate":
		// 								paymentInfo.daysLate,
		// 							$set: {},
		// 						}
		// 					).catch((error) => {
		// 						console.log(
		// 							"there was an error on is deal payment late",
		// 							error
		// 						);
		// 					});
		// 				}
		// 			}
		// 		}
		// 	}

		// 	// Return the list of all deals, possibly with their updated statuses.
		// 	return allDeals;
		// },

		// ! fiixxxx thisssss
		isDealPaymentPayed: async (parent, args, context, info) => {
			const allDeals = await dealResolvers?.Query?.getAllDeals();
			const today = moment();
			const bulkOps = []; // Array to store bulk operations

			for (const deal of allDeals) {
				let dealUpdated = false;
				const lastUpdate = moment(deal.updatedAt);
				const daysSinceLastUpdate = today.diff(lastUpdate, "days");

				if (daysSinceLastUpdate >= 1) {
					for (const paymentInfo of deal.paymentDates) {
						const paymentDueDate = moment(
							paymentInfo.dateOfPayment
						);
						const daysLate = today.diff(paymentDueDate, "days");

						if (daysLate > 0) {
							if (!paymentInfo.isLate) {
								paymentInfo.isLate = true;
								// Add initial late fee of $80
								let latenessFee = 80;
								bulkOps.push({
									updateOne: {
										filter: {
											id: deal.id,
											"paymentDates.payment_id":
												paymentInfo.payment_id,
										},
										update: {
											$set: {
												"paymentDates.$.isLate": true,
												"paymentDates.$.latenessFee":
													latenessFee,
												"paymentDates.$.daysLate":
													daysLate,
											},
										},
									},
								});
								dealUpdated = true;
							}
							if (daysLate <= 45) {
								// Calculate late fee for subsequent days
								let latenessFee = 80 + 10 * (daysLate - 1);
								latenessFee = Math.min(
									latenessFee,
									80 + 10 * 44
								); // Cap at $440
								bulkOps.push({
									updateOne: {
										filter: {
											id: deal.id,
											"paymentDates.payment_id":
												paymentInfo.payment_id,
										},
										update: {
											$set: {
												"paymentDates.$.latenessFee":
													latenessFee,
												"paymentDates.$.daysLate":
													daysLate,
											},
										},
									},
								});
								dealUpdated = true;
							}
						}
					}
				}
			}

			if (bulkOps.length > 0) {
				await Deal.bulkWrite(bulkOps)
					.then((updatedDeals) => {
						console.log(updatedDeals);
						return updatedDeals;
					})
					.catch((err) => {
						console.log("Error performing bulk write", err);
					});
			}

			return allDeals;
		},
	},

	Subscription: {
		onDealChange: {
			subscribe: () =>
				pubsub.asyncIterator([
					"DEAL_ADDED",
					"DEAL_UPDATED",
					"DEAL_DELETED",
				]),
		},
	},

	Deal: {
		// Use toISOString() for custom DateTime scalar
		createdAt: (deal) => deal.createdAt.toISOString(),
		updatedAt: (deal) => deal.updatedAt.toISOString(),
	},
};

// Schedule the function to run every day at a specific time (e.g., midnight)
cron.schedule("0 0 * * *", async () => {
	try {
		await dealResolvers.Mutation.isDealPaymentPayed(); // Call your function here
		console.log("isDealPaymentPayed function executed successfully");
	} catch (error) {
		console.error("Error executing isDealPaymentPayed:", error);
	}
});

module.exports = { dealResolvers };
