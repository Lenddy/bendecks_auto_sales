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
				.populate("vehicle_id")
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
				.populate("vehicle_id")
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
				client_id,
				vehicle_id,
			}
		) => {
			paymentDates = paymentDates.map((paymentDate) => {
				return {
					...paymentDate,
					payment_id: uuidv4(), // Generates a unique UUID
				};
			});
			const createdAt = new Date().toISOString(); // Use toISOString() for custom DateTime scalar
			const updatedAt = new Date().toISOString(); // Use toISOString() for custom DateTime scalar
			//Date;

			return await Deal.create({
				dayOfDeal,
				downPayment,
				payment,
				paymentDates,
				remainingBalance,
				sellingPrice,
				client_id,
				vehicle_id,
				createdAt,
				updatedAt,
			})
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
				paymentDate,
				remainingBalance,
				sellingPrice,
			} = args;
			const update = { updatedAt: new Date().toISOString() }; // Use toISOString() for custom DateTime

			if (downPayment !== undefined) {
				update.downPayment = downPayment;
			}
			if (payment !== undefined) {
				update.payment = payment;
			}
			if (paymentDate !== undefined) {
				update.paymentDate = paymentDate;
			}
			if (remainingBalance !== undefined) {
				update.remainingBalance = remainingBalance;
			}
			if (sellingPrice !== undefined) {
				update.sellingPrice = sellingPrice;
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

		updateOneDealPayment: async (parent, args, context, info) => {
			const { id, payment_id, amountPayedThisMonth } = args;
			// const update = { updatedAt: new Date().toISOString() }; // Use toISOString() for custom DateTime
			// const updatedDeal =

			const oneDeal = await dealResolvers?.Query?.getOneDeal(null, {
				id,
			});
			const paymentInfo = oneDeal.paymentDates.find(
				(pd) => pd?.payment_id === payment_id
			);

			if (!paymentInfo) {
				throw new Error("Payment not found");
			}
			// Calculate the new total amount paid
			const newAmountPayedThisMonth =
				paymentInfo?.amountPayedThisMonth + amountPayedThisMonth;

			// Check if the total amount exceeds hasToPay
			const monthFullyPay =
				newAmountPayedThisMonth >= paymentInfo?.hasToPay;

			return await Deal.findOneAndUpdate(
				{ id, "paymentDates.payment_id": payment_id },
				{
					$set: {
						// "paymentDates.isPaid": true,
						"paymentDates.$.amountPayedThisMonth":
							newAmountPayedThisMonth,
						"paymentDates.$.monthFullyPay": monthFullyPay,
						updatedAt: new Date().toISOString(),
					},
				},
				{ new: true } // Return the updated document
			)
				.then(async (updatedDeal) => {
					pubsub.publish("DEAL_UPDATED", {
						onDealChange: {
							eventType: "DEAL_UPDATED",
							dealChanges: updatedDeal,
						},
					});

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
						"there was an error updating a deal payment",
						err,
						"\n____________________"
					);
					throw err;
				});
		},

		// !!!!! fix the function so that i can handle multiple days  late you can make use of a if that checks if the isLate field is set to true so you can add a multiplier base on how many days the payment is late you might want to the nested else if //todo   and you might want to add a new field on the paymentDates  to lattestUpdate and the update is going to be the latest date that it was updated  so you so you have to make use of the  deals updated at
		isDealPaymentPayed: async (parent, args, context, info) => {
			// Retrieve all deals using a query function 'getAllDeals'.
			const allDeals = await dealResolvers?.Query?.getAllDeals();

			// Get the current date using moment.js.
			const today = moment();

			// Iterate over each deal in the list of all deals.
			for (const deal of allDeals) {
				let dealUpdated = false; // Flag to track if the deal has been updated.
				const lastUpdate = moment(deal.updatedAt); // Get the last update time of the deal.
				const daysSinceLastUpdate = today.diff(lastUpdate, "days"); // Calculate days since the last update.

				// Check if at least one day has passed since the last update.
				if (daysSinceLastUpdate >= 1) {
					// Iterate over each payment information in the deal.
					for (const paymentInfo of deal.paymentDates) {
						const paymentDueDate = moment(
							paymentInfo.dateOfPayment
						); // Get the due date for the payment.
						const daysLate = today.diff(paymentDueDate, "days"); // Calculate how many days late the payment is.

						let firstCheck = false; // Flag to indicate if it's the first check for lateness.

						// Check if the payment is late.
						if (daysLate > 0) {
							// If the payment is not already marked as late, add a late fee of $80 and set the flag to true.
							if (!paymentInfo.isLate) {
								paymentInfo.latenessFee = 80;
								paymentInfo.isLate = true;
								firstCheck = true;
							}
							// If it's the first time marking as late and within 45 days, add $10 fee for each day late except the first day.
							if (daysLate <= 45 && firstCheck) {
								paymentInfo.latenessFee += 10 * (daysLate - 1);
							}

							// If it's not the first check and the payment is within 45 days late, add $10 fee for each day late.
							if (daysLate <= 45 && firstCheck === false) {
								paymentInfo.latenessFee += 10 * daysLate;
							}
							// Cap the lateness fee at a maximum value.
							paymentInfo.latenessFee = Math.min(
								paymentInfo.latenessFee,
								80 + 10 * 44
							);
							paymentInfo.daysLate = daysLate; // Update the number of days late.
							dealUpdated = true; // Mark the deal as updated.
						}

						// If the deal was updated, save the changes to the database.
						if (dealUpdated) {
							console.log("doing the update");
							await Deal.updateOne(
								{
									id: deal.id,
									"paymentDates.payment_id":
										paymentInfo.payment_id,
								},
								{
									"paymentDates.$.isLate": paymentInfo.isLate,
									"paymentDates.$.latenessFee":
										paymentInfo.latenessFee,
									"paymentDates.$.daysLate":
										paymentInfo.daysLate,
									$set: {},
								}
							).catch((error) => {
								console.log(
									"there was an error on is deal payment late",
									error
								);
							});
						}
					}
				}
			}

			// Return the list of all deals, possibly with their updated statuses.
			return allDeals;
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
