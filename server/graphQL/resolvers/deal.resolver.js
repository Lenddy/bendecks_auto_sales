const Deal = require("../../models/deal.model");
// const Client = require("../../models/client.model");
// const Deal = require("../../models/vehicle.model");
const { mongoose } = require("mongoose");
const { v4: uuidv4 } = require("uuid");

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
					// Use the getOneDeal method to fetch and populate the new deal
					return await dealResolvers.Query.getOneDeal(_, {
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
			// console.table(
			// 	"|||||||||||",
			// 	newAmountPayedThisMonth,
			// 	"|||||||||||"
			// );

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

		deleteOneDeal: async (_, { id }) => {
			return await Deal.findByIdAndDelete(id)
				.then((deletedDeal) => {
					console.log(
						" a deal was deleted",
						deletedDeal,
						"\n____________________"
					);
					return deletedDeal;
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
	Deal: {
		// Use toISOString() for custom DateTime scalar
		createdAt: (deal) => deal.createdAt.toISOString(),
		updatedAt: (deal) => deal.updatedAt.toISOString(),
	},
};

module.exports = { dealResolvers };
