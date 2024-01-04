const Deal = require("../../models/deal.model");

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
		createOneDeal: async (_, args) => {
			const {
				downPayment,
				payment,
				paymentDate,
				remainingBalance,
				sellingPrice,
				client_id,
				vehicle_id,
			} = args;
			const createdAt = new Date().toISOString();
			const updatedAt = new Date().toISOString();
			//Date;
			return await Deal.create({
				downPayment,
				payment,
				paymentDate,
				remainingBalance,
				sellingPrice,
				client_id,
				vehicle_id,
				createdAt,
				updatedAt,
			})
				.then((newDeal) => {
					console.log(
						"new deal created",
						newDeal,
						"\n____________________"
					);
					return newDeal;
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
				client_id,
				vehicle_id,
			} = args;
			const update = { updatedAt: new Date().toISOString() };

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
			if (client_id !== undefined) {
				update.client_id = client_id;
			}
			if (vehicle_id !== undefined) {
				update.vehicle_id = vehicle_id;
			}

			return await Deal.findByIdAndUpdate(id, update, {
				new: true,
			})
				.then((updatedDeal) => {
					console.log(
						"deal updated",
						updatedDeal,
						"\n____________________"
					);
					return updatedDeal;
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
};

module.exports = { dealResolvers };
