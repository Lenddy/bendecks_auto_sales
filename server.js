const express = require("express"); //importing express
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

	app.listen(process.env.port, () =>
		console.log(
			`listening on port ${process.env.port}\nhttp://localhost:${process.env.port}/graphql/`
		)
	); //alerts that the server is running
};

startServer(); //calling  the function
