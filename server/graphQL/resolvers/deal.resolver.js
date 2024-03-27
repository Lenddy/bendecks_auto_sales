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
				.then(deals => {
					console.log("all the deals", deals, "\n____________________");
					return deals;
				})
				.catch(err => {
					console.log("there was an error fetching all the deals", err, "\n____________________");
					throw err;
				}); //gets all the vehicles(items) in the data base
		},

		getOneDeal: async (_, { id }) => {
			return await Deal.findById(id)
				.populate("client_id")
				.then(deal => {
					console.log("one deal ", deal, "\n____________________");
					return deal;
				})
				.catch(err => {
					console.log("there was an error fetching one deal", err, "\n____________________");
					throw err;
				}); //gets one the vehicle(item) from the data base
		},
	},

	Mutation: {
		createOneDeal: async (_, { dayOfDeal, downPayment, payment, dealPayments, remainingBalance, sellingPrice, carName, carModel, carColor, carYear, client_id }) => {
			const create = { dayOfDeal, downPayment, payment, remainingBalance, totalLatenessFee: parseFloat(0), sellingPrice, carName, carModel, client_id };

			dealPayments = dealPayments.map(dealPayments => {
				return {
					payment_id: uuidv4(), // Generates a unique UUID
					...dealPayments,
				};
			});
			console.log("this is the deal", dealPayments);
			const createdAt = new Date().toISOString(); // Use toISOString() for custom DateTime scalar
			const updatedAt = new Date().toISOString(); // Use toISOString() for custom DateTime scalar
			//Date;
			create.createdAt = createdAt;
			create.updatedAt = updatedAt;
			create.dealPayments = dealPayments;

			if (carColor !== undefined) {
				create.carColor = carColor;
			}

			if (carYear !== undefined) {
				create.carYear = carYear;
			}
			console.log("this is the create ", create);
			return await Deal.create(create)
				.then(async newDeal => {
					console.log("new deal created", newDeal, "\n____________________");
					const deal = await dealResolvers.Query.getOneDeal(null, {
						id: newDeal.id,
					});
					pubsub.publish("DEAL_ADDED", {
						onDealChange: {
							eventType: "DEAL_ADDED",
							dealChanges: deal,
						},
					});
					// Use the getOneDeal method to fetch and populate the new deal
					return deal;
				})
				.catch(err => {
					console.log("there was an error creating a new Deal", err, "\n____________________");
					throw err;
				});
		},

		updateOneDeal: async (parent, args, context, info) => {
			const { id, downPayment, payment, remainingBalance, sellingPrice, carName, carModel, carColor, carYear } = args;
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
				.then(async updatedDeal => {
					console.log("deal updated", updatedDeal, "\n____________________");
					return await dealResolvers.Query.getOneDeal(null, {
						id: updatedDeal.id,
					});
				})
				.catch(err => {
					console.log("there was an error updating a deal", err, "\n____________________");
					throw err;
				});
		},

		updateOneDealPayment: async (parent, { id, selectedPayments, amountPayed }, context, info) => {
			const update = { updatedAt: new Date().toISOString() }; // Use toISOString() for custom DateTime

			if (selectedPayments !== undefined && selectedPayments.length > 0) {
				console.log("the selectedPayments hit");
				const bulkOps = [];
				for (payment of selectedPayments) {
					bulkOps.push({
						updateOne: {
							filter: {
								_id: id,
								"dealPayments.payment_id": payment.payment_id,
							},
							update: {
								$set: {
									"dealPayments.$.monthFullyPay": true,
									"dealPayments.$.amountPayedThisMonth": payment.hasToPay,
									// "dealPayments.$.remainingBalance":payment.remainingBalance -payment.hasToPay,
									"dealPayments.$.hasToPay": payment.hasToPay - payment.hasToPay,
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

				for (const payment of amountPayed.dealPayments) {
					if (remainingAmount <= 0) {
						console.log("breaking the loop");
						break;
					}
					// Calculate the amount to be paid for this payment
					const paymentAmount = Math.min(remainingAmount, payment.hasToPay);

					bulkOps.push({
						updateOne: {
							filter: {
								_id: id,
								"dealPayments.payment_id": payment.payment_id,
							},
							update: {
								$set: {
									"dealPayments.$.monthFullyPay": paymentAmount >= payment.hasToPay, // Check if the payment is fully paid
									"dealPayments.$.amountPayedThisMonth": paymentAmount,
									"dealPayments.$.hasToPay": payment.hasToPay - paymentAmount,
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
				.then(async updatedDeal => {
					const deal = await dealResolvers.Query.getOneDeal(null, {
						id: updatedDeal.id,
					});

					pubsub.publish("DEAL_UPDATED", {
						onDealChange: {
							eventType: "DEAL_UPDATED",
							dealChanges: deal,
						},
					});

					// console.log(
					// 	"deal updated",
					// 	updatedDeal,
					// 	"\n____________________"
					// );
					return deal;
				})
				.catch(err => {
					console.log("there was an error updating a deal payment", err, "\n____________________");
					throw err;
				});
		},

		deleteOneDeal: async (_, { id }) => {
			const deal = await dealResolvers.Query.getOneDeal(null, {
				id: id,
			});
			return await Deal.findByIdAndDelete(id)
				.then(async deletedDeal => {
					pubsub.publish("DEAL_DELETED", {
						onDealChange: {
							eventType: "DEAL_DELETED",
							dealChanges: deal,
						},
					});

					console.log(" a deal was deleted", deal, "\n____________________");
					return true;
				})
				.catch(err => {
					console.log("there was an error deleting a deal", err, "\n____________________");
					throw err;
				});
		},

		isDealPaymentPayed: async (parent, args, context, info) => {
			const allDeals = await dealResolvers?.Query?.getAllDeals(); //getting all the deals
			const today = moment(); //getting todays date
			const bulkOps = []; // Array to store bulk operations
			let latenessFee; // gets the fee amount for every late day
			let updateDays;
			let updatedHasToPay;
			let updatedLatenessFee;

			for (const deal of allDeals) {
				//looping over all the deals to get every individual one
				// deal.updatedAt
				const lastUpdate = moment(deal.updatedAt, "YYYY-M-D"); //gets the last date that it was updated (update this to be the updated at )
				const daysSinceLastUpdate = Math.max(today.diff(lastUpdate, "days"), 0); //compare todays against the last updated to get the days difference

				if (daysSinceLastUpdate >= 1) {
					//condition to to run if days since last update is bigger or == to 1
					for (const paymentInfo of deal.dealPayments) {
						//loops over all the payment dates for each deal
						const dueDate = moment(paymentInfo.dateOfPayment, "YYYY-M-D"); //getting due date for every due dates for every payment

						const daysLate = Math.max(today.diff(dueDate, "days"), 0); //getting the days late  if a payment has not ben made
						if (daysLate == 1) {
							//if days late is bigger that 0 runs a condition
							if (paymentInfo.isLate === false && daysLate == 1) {
								//runs a condition if the is late field is false in a individual payment
								console.log("one the is late == false _________________________");

								bulkOps.push(
									{
										//pushes to the bulk array to make a multi update  depending on how many update are added

										updateOne: {
											//updates one deal

											filter: {
												_id: deal.id, //gets the deal with a given id
												"dealPayments.payment_id": paymentInfo.payment_id, //get the dealPayments of that deals that has a given payment_id
											},
											update: {
												//new info that is updated

												$set: {
													"dealPayments.$.isLate": true, //set is late to be true
													"dealPayments.$.hasToPay": (paymentInfo.hasToPay += 80), //set has to pay a new value
													"dealPayments.$.latenessFee": 80, //sets late ness fee to 80 dollars
													"dealPayments.$.daysLate": 1, //set days late to be the given amount of late days
												},
											},
										},
									},

									{
										updateOne: {
											//updates one deal

											filter: {
												_id: deal.id, //gets the deal with a given id
											},
											update: {
												//new info that is updated
												$set: {
													remainingBalance: (deal.remainingBalance += 80), //sets late ness fee to 80 dollars
													totalLatenessFee: (deal.totalLatenessFee += 80), //sets totalLatenessFee a a new given amount
												},
											},
										},
									}
								);
							}

							if (paymentInfo.isLate === true && daysLate == 1) {
								latenessFee = paymentInfo.latenessFee + 10;
								updateDays = daysLate + paymentInfo.daysLate;
								latenessFee = Math.min(latenessFee, 520); // Cap at $520
								updateDays = Math.min(updateDays, 45); // Cap at 45 days
								updatedHasToPay = paymentInfo.hasToPay += 10;
								updatedLatenessFee = latenessFee;

								bulkOps.push(
									{
										//pushes to the bulk array to make a multi update  depending on how many update are added
										updateOne: {
											//updates one deal
											filter: {
												_id: deal.id, //gets the deal with a given id
												"dealPayments.payment_id": paymentInfo.payment_id, //get the dealPayments of that deals that has a given payment_id
											},
											update: {
												//new info that is updated
												$set: {
													"dealPayments.$.isLate": true, //set is late to be true
													"dealPayments.$.hasToPay": updatedHasToPay, //set has to pay a new value
													"dealPayments.$.latenessFee": updatedLatenessFee, //sets late ness fee to the calculated amount
													"dealPayments.$.daysLate": updateDays, //set days late to be the given amount of late days
												},
											},
										},
									},

									//pushes to the bulk array to make a multi update  depending on how many update are added

									{
										updateOne: {
											//updates one deal

											filter: {
												_id: deal.id, //gets the deal with a given id
											},
											update: {
												//new info that is updated
												$set: {
													remainingBalance: (deal.remainingBalance += 10), //sets late ness fee to 80 dollars
													totalLatenessFee: (deal.totalLatenessFee += 10), //sets totalLatenessFee a a new given amount
												},
											},
										},
									}
								);
							}
						}

						if (daysLate > 1 && daysLate <= 45) {
							//if days late is less than or === to 45 it runs a this condition

							let prevHasToPay = paymentInfo.hasToPay;
							let prevLateness = paymentInfo.latenessFee;
							let prevDaysLate = paymentInfo.daysLate;
							let prevRemainingBalance = deal.remainingBalance;
							let prevTotalLatenessFee = deal.totalLatenessFee;

							if (prevDaysLate === 0 && paymentInfo.isLate === false) {
								latenessFee = 80 + 10 * (daysLate - 1);
								latenessFee = Math.min(latenessFee, 520); // Cap at $520
								updatedHasToPay = prevHasToPay + latenessFee;
								updatedLatenessFee = prevLateness + latenessFee;
								updateDays = daysLate;
							} else if (prevDaysLate >= 1 && paymentInfo.isLate === true) {
								latenessFee = 10 * daysLate;
								latenessFee = Math.min(latenessFee, 520); // Cap at $520
								updatedHasToPay = latenessFee + prevHasToPay;
								updatedLatenessFee = prevLateness + latenessFee;
								updateDays = daysLate + prevDaysLate;
							}

							updateDays = Math.min(updateDays, 45); // Cap at 45 days

							// console.log({
							// 	"prev-Has-To-Pay": prevHasToPay,
							// 	"updated-Has-To-Pay": updatedHasToPay,
							// 	"prev-LateNess": prevLateness,
							// 	"updated-LateNess": updatedLatenessFee,
							// 	"prev-Days-Late": prevDaysLate,
							// 	"updated-Days-Late": updateDays,
							// 	"prev-Remaining-Balance": prevRemainingBalance,
							// 	"updated-Remaining-Balance": prevRemainingBalance + latenessFee,
							// 	"prev-total-Lateness": prevTotalLatenessFee,
							// 	"updated-total-Lateness": prevTotalLatenessFee + latenessFee,
							// });

							bulkOps.push(
								{
									//pushes to the bulk array to make a multi update  depending on how many update are added
									updateOne: {
										//updates one deal
										filter: {
											_id: deal.id, //gets the deal with a given id
											"dealPayments.payment_id": paymentInfo.payment_id, //get the dealPayments of that deals that has a given payment_id
										},
										update: {
											//new info that is updated
											$set: {
												"dealPayments.$.isLate": true, //set is late to be true
												"dealPayments.$.hasToPay": updatedHasToPay, //set has to pay a new value
												"dealPayments.$.latenessFee": updatedLatenessFee, //sets late ness fee to the calculated amount
												"dealPayments.$.daysLate": updateDays, //set days late to be the given amount of late days
											},
										},
									},
								},

								{
									updateOne: {
										//updates one deal

										filter: {
											_id: deal.id, //gets the deal with a given id
										},
										update: {
											//new info that is updated
											$set: {
												remainingBalance: prevRemainingBalance + latenessFee, //sets late ness fee to 80 dollars
												totalLatenessFee: prevTotalLatenessFee + latenessFee, //sets totalLatenessFee a a new given amount
											},
										},
									},
								}
							);
						}
					}
				}
			}

			if (bulkOps.length > 0) {
				await Deal.bulkWrite(bulkOps)
					.then(updatedDeals => {
						return updatedDeals;
					})
					.catch(err => {
						console.log("Error performing bulk write", err);
					});
			}

			return await dealResolvers?.Query?.getAllDeals();
		},
	},

	Subscription: {
		onDealChange: {
			subscribe: () => pubsub.asyncIterator(["DEAL_ADDED", "DEAL_UPDATED", "DEAL_DELETED"]),
		},
	},

	Deal: {
		// Use toISOString() for custom DateTime scalar
		createdAt: deal => deal.createdAt.toISOString(),
		updatedAt: deal => deal.updatedAt.toISOString(),
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
