const Client = require("../../models/client.model");
const { PubSub } = require("graphql-subscriptions");

const pubsub = new PubSub();

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
		createOneClient: async (_, args) => {
			const { clientName, clientLastName, cellPhone } = args;
			const createdAt = new Date().toISOString(); // Use toISOString() for custom DateTime scalar
			const updatedAt = new Date().toISOString(); // Use toISOString() for custom DateTime scalar

			//Date;
			return await Client.create({
				clientName,
				clientLastName,
				cellPhone,
				createdAt,
				updatedAt,
			})
				.then((newClient) => {
					pubsub.publish("CLIENT_ADDED", {
						onClientChange: newClient,
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
			const { id, clientName, clientLastName, cellPhone } = args;
			const update = { updatedAt: new Date().toISOString() }; // Use toISOString() for custom DateTime scalar
			// title,description

			if (clientName !== undefined) {
				update.clientName = clientName;
			}
			if (clientLastName !== undefined) {
				update.clientLastName = clientLastName;
			}
			if (cellPhone !== undefined) {
				update.cellPhone = cellPhone;
			}

			return await Client.findByIdAndUpdate(id, update, {
				new: true,
			})
				.then((updatedClient) => {
					console.log(
						"client updated",
						updatedClient,
						"\n____________________"
					);
					return updatedClient;
				})
				.catch((err) => {
					console.log(
						"there was an error updating a client",
						err,
						"\n____________________"
					);
					throw err;
				});
		},

		deleteOneClient: async (_, { id }) => {
			return await Client.findByIdAndDelete(id)
				.then((deletedClient) => {
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
	},

	Subscription: {
		onClientChange: {
			subscribe: () =>
				pubsub.asyncIterator([
					"CLIENT_ADDED",
					"CLIENT_UPDATED",
					"CLIENT_DELETED",
				]),
			// Resolve function if needed (to handle subscription payload transformations)
			// resolve: (payload) => payload.clientAdded,
		},
		onNewClient: {
			subscribe: () => pubsub.asyncIterator("CLIENT_ADDED"),
			// Resolve function if needed (to handle subscription payload transformations)
			// resolve: (payload) => payload.clientAdded,
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
