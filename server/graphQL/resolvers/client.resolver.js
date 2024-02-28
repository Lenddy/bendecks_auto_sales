const Client = require("../../models/client.model");
const { v4: uuidv4 } = require("uuid");
const pubsub = require("../pubsub");

// const pubsub = new PubSub();

const clientResolvers = {
	Query: {
		hello: async () => {
			return "hello world";
		},
		getAllClients: async () => {
			return await Client.find()
				.then((clients) => {
					console.log(
						"all the clients",
						clients,
						"\n____________________"
					);
					return clients;
				})
				.catch((err) => {
					console.log(
						"there was an error fetching all the clients",
						err,
						"\n____________________"
					);
					throw err;
				}); //gets all the client(items) in the data base
		},
		getOneClient: async (_, { id }) => {
			return await Client.findById(id)
				.then((client) => {
					console.log(
						"one client ",
						client,
						"\n____________________"
					);
					return client;
				})
				.catch((err) => {
					console.log(
						"there was an error fetching one client",
						err,
						"\n____________________"
					);
					throw err;
				}); //gets one the client(item) from the data base
		},
	},

	Mutation: {
		//! make it work with objects
		// payment_id: uuidv4(),
		createOneClient: async (
			_,
			{ clientName, clientLastName, cellPhones }
		) => {
			const createdAt = new Date().toISOString(); // Use toISOString() for custom DateTime scalar
			const updatedAt = new Date().toISOString(); // Use toISOString() for custom DateTime scalar

			cellPhones = cellPhones.map((numberDate) => {
				return {
					...numberDate,
					numberId: uuidv4(), // Generates a unique UUID
				};
			});

			//Date;
			return await Client.create({
				clientName,
				clientLastName,
				cellPhones,
				createdAt,
				updatedAt,
			})
				.then((newClient) => {
					// When a client is added
					pubsub.publish("CLIENT_ADDED", {
						onClientChange: {
							eventType: "CLIENT_ADDED",
							clientChanges: newClient,
						},
					});
					console.log(
						"new client created",
						newClient,
						"\n____________________"
					);
					// pubsub.publish("CLIENT_ADDED", { clientAdded: newClient });
					return newClient;
				})
				.catch((err) => {
					console.log(
						"there was an error creating a new client",
						err,
						"\n____________________"
					);
					throw err;
				});
		},

		updateOneClient: async (parent, args, context, info) => {
			const { id, clientName, clientLastName, cellPhones } = args;
			const update = { updatedAt: new Date().toISOString() };

			if (clientName !== undefined) {
				update.clientName = clientName;
			}
			if (clientLastName !== undefined) {
				update.clientLastName = clientLastName;
			}
			if (cellPhones !== undefined && cellPhones.length > 0) {
				console.log("cellPhone ------>", cellPhones);
				// Loop through each phone object in cellPhones array
				for (const phone of cellPhones) {
					if (phone.status === "update") {
						// If status is update, set the updated phone number
						const numberId = phone.numberId;
						const numberKey = `cellPhones.$[elem${
							numberId ? "." + numberId : ""
						}].number`;
						update.$set = update.$set || {};
						update.$set[numberKey] = phone.number;
					}
				}
			}

			console.log("update object ->>>>>>>>", update);

			const options = {
				arrayFilters: [{ "elem.numberId": { $exists: true } }],
				new: true,
			};

			return await Client.findByIdAndUpdate(id, update, options)
				.then((updatedClient) => {
					// Publish event after client is updated
					pubsub.publish("CLIENT_UPDATED", {
						onClientChange: {
							eventType: "CLIENT_UPDATED",
							clientChanges: updatedClient,
						},
					});
					console.log("Client updated:", updatedClient);
					return updatedClient;
				})
				.catch((err) => {
					console.log("Error updating client:", err);
					throw err;
				});
		},
		// !you change the cellPhones so get the change finish

		// updateOneClient: async (parent, args, context, info) => {
		// 	const { id, clientName, clientLastName, cellPhones } = args;
		// 	const update = { updatedAt: new Date().toISOString() }; // Use toISOString() for custom DateTime scalar
		// 	// title,description
		// 	const updatedCellPhones = {};
		// 	let deleteItem = false;

		// 	if (clientName !== undefined) {
		// 		update.clientName = clientName;
		// 	}
		// 	if (clientLastName !== undefined) {
		// 		update.clientLastName = clientLastName;
		// 	}
		// 	if (cellPhones !== undefined && cellPhones.length > 0) {
		// 		// ! send a array of object that contain number, numberid,status
		// 		// ! loop over the array of objects   if the status is update just add the objects  if the status is delete  grab the number id and search for that element in the db and delete it

		// 		console.log("cellPhones------->", cellPhones);

		// 		cellPhones.forEach((phone) => {
		// 			if (phone.status === "update") {
		// 				updatedCellPhones[`cellPhones.${phone.numberId}`] =
		// 					phone.number;
		// 			}

		// 			console.log(
		// 				"this is the updateCellPhones ---------->",
		// 				updatedCellPhones
		// 			);
		// 		});
		// 		update.$set = updatedCellPhones;
		// 		console.log("this is the update object", update);
		// 	}

		// 	return await Client.findByIdAndUpdate(id, update, {
		// 		new: true,
		// 	})
		// 		.then((updatedClient) => {
		// 			// When a client is updated

		// 			// if (deleteItem) {
		// 			// 	clientResolvers.Mutation.deleteOneClientItem(null, {
		// 			// 		id,
		// 			// 		cellPhone,
		// 			// 	});
		// 			// }
		// 			pubsub.publish("CLIENT_UPDATED", {
		// 				onClientChange: {
		// 					eventType: "CLIENT_UPDATED",
		// 					clientChanges: updatedClient,
		// 				},
		// 			});
		// 			console.log(
		// 				"client updated",
		// 				updatedClient,
		// 				"\n____________________"
		// 			);
		// 			return updatedClient;
		// 		})
		// 		.catch((err) => {
		// 			console.log(
		// 				"there was an error updating a client",
		// 				err,
		// 				"\n____________________"
		// 			);
		// 			throw err;
		// 		});
		// },

		deleteOneClient: async (_, { id }) => {
			return await Client.findByIdAndDelete(id)
				.then((deletedClient) => {
					// When a client is deleted
					pubsub.publish("CLIENT_DELETED", {
						onClientChange: {
							eventType: "CLIENT_DELETED",
							clientChanges: deletedClient,
						},
					});
					console.log(
						" a client was deleted",
						deletedClient,
						"\n____________________"
					);
					return deletedClient;
				})
				.catch((err) => {
					console.log(
						"there was an error deleting a client",
						err,
						"\n____________________"
					);
					throw err;
				});
		},
		deleteOneClientItem: async (parent, args) => {
			const { id, cellPhone } = args;
			const update = { updatedAt: new Date().toISOString() }; // Use toISOString() for custom DateTime scalar

			try {
				// First, find the client document
				const client = await Client.findById(id);
				if (!client) {
					throw new Error("Client not found");
				}
				console.log("client was found trying to delete the number");

				// If cellPhone array is provided and not empty
				if (Array.isArray(cellPhone) && cellPhone.length > 0) {
					console.log("this is  cellphone array");
					// Iterate through each phone item
					for (const phone of cellPhone) {
						if (phone.status === "delete") {
							console.log("this number is to be deleted");
							// Construct a filter to remove the specified number
							const filter = {
								$and: [
									{ [`cellPhone.${phone.id}`]: phone.number },
									{
										[`cellPhone.${phone.id}`]: {
											$exists: true,
										},
									},
								],
							};

							console.log("this is the filter for the deletion");
							// Use updateOne to remove the specified number from the array
							await Client.updateOne(
								{ _id: id },
								{ $pull: filter }
							);
						}
					}
				}

				console.log("A client item was deleted -------> ", true);
				return true;
			} catch (err) {
				console.log("There was an error deleting a client item", err);
				throw err;
			}
		},
	},
	Subscription: {
		onClientChange: {
			subscribe: () =>
				pubsub.asyncIterator([
					"CLIENT_ADDED",
					"CLIENT_UPDATED",
					"CLIENT_DELETED",
					// "VEHICLE_ADDED",
					// "VEHICLE_UPDATED",
					// "VEHICLE_DELETED",
				]),
		},
	},

	Client: {
		// Use toISOString() for custom DateTime scalar
		createdAt: (client) => client.createdAt.toISOString(),
		updatedAt: (client) => client.updatedAt.toISOString(),
	},
};

module.exports = { clientResolvers };
// pubsub.publish()
