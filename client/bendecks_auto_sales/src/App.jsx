import "./App.css";

import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	HttpLink,
	from,
} from "@apollo/client"; //Import necessary modules from Apollo Client and other dependencies
import { onError } from "@apollo/client/link/error"; // Import error handler from Apollo Client

import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Log_reg from "./components/Log_reg";

import GetAllClients from "./components/clients/GetAllClients";
import GetOneClient from "./components/clients/GetOneClient";
import CreateOneClient from "./components/clients/CreateOneClient";
import UpdateOneClient from "./components/clients/UpdateOneClient";
import DeleteOneClient from "./components/clients/DeleteOneClient";

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

// Create an instance of the Apollo Client to connect to the Apollo Server
const client = new ApolloClient({
	cache: new InMemoryCache(), // Set up an in-memory cache for caching query results
	link: link, // Connect to the defined backend API link
});

// Define the main App component
function App() {
	const [reload, setReload] = useState(false);
	return (
		// Wrap the app with ApolloProvider to access Apollo Client functionalities
		<div>
			<ApolloProvider client={client}>
				<Routes>
					<Route exact path="/" element={<Log_reg />} />
					<Route
						exact
						path="/dashboard"
						element={<GetAllClients reload={reload} />}
					/>
					<Route exact path="/:id" element={<GetOneClient />} />

					<Route
						exact
						path="/createOneClient"
						element={
							<CreateOneClient
								reload={reload}
								setReload={setReload}
							/>
						}
					/>

					<Route
						exact
						path="/update/:id"
						element={<UpdateOneClient />}
					/>

					<Route
						exact
						path="/delete/:id"
						element={<DeleteOneClient />}
					/>
				</Routes>
			</ApolloProvider>
		</div>
	);
}
export default App;