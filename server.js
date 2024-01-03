const express = require("express"); //importing express
const { ApolloServer } = require("apollo-server-express"); //importing ApolloServer to start the graphQL server

// importing the types and the resolvers
const { typeDefs } = require("./server/graphQL/types/list_types");
const { resolvers } = require("./server/graphQL/resolvers/list_resolver");

const startServer = async () => {
	//making a promise function
	const app = express(); // initializing express

	const apolloServer = new ApolloServer({
		// creating a new apollo server instance
		typeDefs,
		resolvers,
	});

	await apolloServer.start(); //starting the apollo server

	apolloServer.applyMiddleware({ app }); //applying the apolloServer to the express app

	await require("./server/config/config"); //waiting for a response from the data bade

	app.listen(8000, () => console.log("listening on port 8000")); //alerts that the server is running
};

startServer(); //calling  the function
