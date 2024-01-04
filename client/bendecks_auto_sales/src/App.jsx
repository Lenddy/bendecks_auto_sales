import { useState } from "react";
import "./App.css";
import {
	ApolloClient,
	InMemoryCache,
	ApolloProvider,
	HttpLink,
	from,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error"; //to create and error catcher

import GetAllList from "./components/GetAllList";
import CreateOneList from "./components/CreateOneList";
const errorLink = onError(({ graphqlErrors, networkError }) => {
	if (graphqlErrors) {
		graphqlErrors.map(({ message, location, path }) => {
			alert(`Graphql error ${message}`);
		});
	}
}); // catches errors if somethings goes wrong when getting the info from the api

//creating a link to the back end api
const link = from([
	errorLink, // in case something goes wrong
	new HttpLink({ uri: "http://localhost:8000/graphql" }),
]);

// creating an instance of an apollo client to connect to the apollo server
const client = new ApolloClient({
	cache: new InMemoryCache(),
	link: link, // links to the back end api
});

function App() {
	return (
		<ApolloProvider client={client}>
			{/* allow you to reach all your apollo apis and make request to them  */}
			<CreateOneList />
			<GetAllList />
		</ApolloProvider>
	);
}

export default App;
