// Import necessary modules from Apollo Client and custom GraphQL queries
import {
	useQuery,
	useSubscription,
	gql,
	useApolloClient,
} from "@apollo/client"; // Import useQuery hook to execute GraphQL queries
import { useNavigate, Link, useParams } from "react-router-dom";

import { useState, useEffect } from "react";
import { get_all_clients } from "../../GraphQL/queries/clientQueries";
import { CLIENT_CHANGE_SUBSCRIPTION } from "../../GraphQL/subscriptions/clientSubscriptions";
// import io from "socket.io-client"; //importing socket.io-client

function GetAllClients() {
	// const [socket] = useState(() => io(":8080")); //connect to the server
	const navigate = useNavigate();
	const navigateTO = (url) => {
		navigate(url);
	};

	// use promisees to get all the data

	// Fetch data using the useQuery hook by executing the getAllClients query
	const { error, loading, data } = useQuery(get_all_clients);

	// State to manage Clients and new changes
	const [clients, setClients] = useState([]);
	const [newChange, setNewChange] = useState();

	// Subscription for client changes
	useSubscription(CLIENT_CHANGE_SUBSCRIPTION, {
		onData: (infoChange) => {
			console.log(infoChange);
			const newClient = infoChange.data.data.onClientChange;
			console.log("New data from subscription:", newClient);
			setNewChange(newClient);
		},
	});
	// const client = useApolloClient();
	// useSubscription(CLIENT_CHANGE_SUBSCRIPTION, {
	// 	onData: ({ subscriptionData }) => {
	// 		const newClient = subscriptionData.data.newClient;
	// 		client.cache.modify({
	// 			fields: {
	// 				getAllClients(existingClients = []) {
	// 					const newClientRef = client.cache.writeFragment({
	// 						data: newClient,
	// 						fragment: gql`
	// 							fragment NewClient on Client {
	// 								id
	// 								clientName
	// 							}
	// 						`,
	// 					});

	// 					return [newClientRef, ...existingClients];
	// 				},
	// 			},
	// 		});
	// 	},
	// });

	// Effect for handling new changes and initial data load
	// ? delete the use effect
	useEffect(() => {
		if (newChange) {
			console.log("Client was updated", newChange);
			setClients((prevClients) => [...prevClients, newChange]);
		} else if (loading) {
			console.log("Loading...");
		} else if (data) {
			console.log("All clients:", data);
			setClients(data.getAllClients); // Ensure this matches the structure from your GraphQL server
		} else if (error) {
			console.log("Error:", error);
		}
	}, [error, loading, data, newChange]);

	// // Handle new client from subscription
	// useEffect(() => {
	// 	// if (newChange) {
	// 	// 	setClients((prevClients) => [...prevClients, newChange]);
	// 	// 	console.log("client was updated", clients);
	// 	// }
	// 	if (subscription.loading) {
	// 		console.log("subscription is loading");
	// 	}
	// 	if (subscription.data) {
	// 		console.log("sub data", subscription.data);
	// 	}
	// 	// newChange, client,
	// }, [subscription.loading, subscription.data]);

	return (
		<div>
			{clients.map((c) => {
				return (
					<div key={c?.id}>
						<h1> ID: {c?.id}</h1>
						<p>
							{" "}
							Full Name: {c?.clientName} {c?.clientLastName}
						</p>
						<p>
							Phone Number:{" "}
							{c?.cellPhone?.map((n, idx) => {
								return (
									<span key={idx}>
										<span>{n}</span> ,
									</span>
								);
							})}
						</p>
						<Link to={`/${c?.id}`}>
							<button>view</button>
						</Link>
						<Link to={`/update/${c?.id}`}>
							<button>update</button>
						</Link>
						<Link to={`/delete/${c?.id}`}>
							<button>delete</button>
						</Link>
					</div>
				);
			})}
		</div>
	);
}

export default GetAllClients; // Export the GetAllList component
