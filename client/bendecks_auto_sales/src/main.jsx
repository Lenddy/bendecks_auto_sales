import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	HttpLink,
	from,
	split,
} from "@apollo/client"; //Import necessary modules from Apollo Client and other dependencies

// import {InMemoryCache} from"@apollo-cash-inmemory"

import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { onError } from "@apollo/client/link/error"; // Import error handler from Apollo Client
// Define an error link to catch errors from the GraphQL API
const errorLink = onError(({ graphqlErrors, networkError }) => {
	if (graphqlErrors) {
		graphqlErrors.map(({ message, location, path }) => {
			alert(`Graphql error ${message}`); // Display an alert for GraphQL errors
		});
	}
});

// Create a link to the backend API (GraphQL endpoint)
const link = from([
	errorLink, // Use the error link for error handling
	new HttpLink({ uri: "http://localhost:8080/graphql/ " }), // Define the URL for your GraphQL API
]);

const wsLink = new WebSocketLink({
	uri: "ws://localhost:8080/graphql",
	options: {
		reconnect: true,
	},
});

const splitLink = split(
	({ query }) => {
		const definition = getMainDefinition(query);
		return (
			definition.kind === "OperationDefinition" &&
			definition.operation === "subscription"
		);
	},
	wsLink,
	link
);

// Create an instance of the Apollo Client to connect to the Apollo Server
const client = new ApolloClient({
	link: splitLink, // Connect to the defined backend API link
	cache: new InMemoryCache(), // Set up an in-memory cache for caching query results
});

//  <React.StrictMode>

//  </React.StrictMode>

ReactDOM.createRoot(document.getElementById("root")).render(
	<ApolloProvider client={client}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</ApolloProvider>
);
