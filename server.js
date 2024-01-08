const express = require("express"); //importing express
const { Server, S } = require("socket.io"); // importing socket.io
const { ApolloServer } = require("apollo-server-express"); //importing ApolloServer to start the graphQL server
const { mergeTypeDefs, mergeResolvers } = require("@graphql-tools/merge"); // Import mergeTypeDefs and mergeResolvers
require("dotenv").config();

// importing the types and the resolvers
const { clientTypeDef } = require("./server/graphQL/types/client.typeDef");
const {
	clientResolvers,
} = require("./server/graphQL/resolvers/client.resolver");
const { vehicleTypeDef } = require("./server/graphQL/types/vehicle.typeDef");
const {
	vehicleResolvers,
} = require("./server/graphQL/resolvers/vehicle.resolver");

const { dealTypeDef } = require("./server/graphQL/types/deal.typeDef");
const { dealResolvers } = require("./server/graphQL/resolvers/deal.resolver");

const mergedTypeDefs = mergeTypeDefs([
	clientTypeDef,
	vehicleTypeDef,
	dealTypeDef,
]); // Merge multiple type definitions
const mergedResolvers = mergeResolvers([
	clientResolvers,
	vehicleResolvers,
	dealResolvers,
]); // Merge multiple resolvers

const startServer = async () => {
	//making a promise function
	const app = express(); // initializing express

	const apolloServer = new ApolloServer({
		// creating a new apollo server instance
		typeDefs: mergedTypeDefs,
		resolvers: mergedResolvers,
	});

	await apolloServer.start(); //starting the apollo server

	apolloServer.applyMiddleware({ app }); //applying the apolloServer to the express app

	await require("./server/config/config"); //waiting for a response from the data bade

	const server = app.listen(process.env.port, () =>
		console.log(
			`listening on port ${process.env.port}\nhttp://localhost:${process.env.port}/graphql/`
		)
	); //alerts that the server is running

	let connectedClients = 0;

	// initializing websocket instance that give us websocket funtionality by using socket.io and passing to the server
	const io = new Server(server, {
		cors: {
			origin: "http://localhost:5173",
			// Credential: true,
		},
	});

	// when a new client(tab on the browser) joins(connects to the app) this io.on("connection") listener will get triggered
	io.on("connection", (socket) => {
		connectedClients++;
		console.log(
			`new client has join us we now have ${connectedClients} clients connected and the socket id are:${socket.id} `
		);
		socket.on("new_client_added", (clientInfo) => {
			console.log("receive client info", clientInfo);
			//pubsub.publish("CLIENT_ADDED", { newClientInfo });  Publish the new client data
			socket.broadcast.emit("reload_client_list", clientInfo);
		});
	});
};

startServer(); //calling  the function
