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
import { CLIENT_CHANGE_SUBSCRIPTION } from "../../GraphQL/subscriptions/subscriptions";
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
	const [search, setSearch] = useState("");
	const [clients, setClients] = useState([]);
	// const [newChange, setNewChange] = useState();

	// Subscription for client changes
	useSubscription(CLIENT_CHANGE_SUBSCRIPTION, {
		onData: (infoChange) => {
			console.log("this the subscription :", infoChange);
			const changeClient = infoChange?.data?.data?.onClientChange;
			const { eventType, clientChanges } = changeClient;
			console.log("New data from subscription:", changeClient);

			if (eventType === "CLIENT_ADDED") {
				// Handle new client addition
				setClients((prevClients) => [...prevClients, clientChanges]);
			} else if (eventType === "CLIENT_UPDATED") {
				// Handle client update
				setClients((prevClients) =>
					prevClients.map((c) =>
						c.id === clientChanges.id ? clientChanges : c
					)
				);
			} else if (eventType === "CLIENT_DELETED") {
				// Handle client deletion
				setClients((prevClients) =>
					prevClients.filter((c) => c.id !== clientChanges.id)
				);
			} else {
				console.log("Unknown event type");
			}
			// eventType;
			// clientChanges;

			// setNewChange(changeClient);
			// setClients((prevClients) => [...prevClients, newChange]);
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
		// if (newChange) {
		// 	console.log("Client was updated", newChange);
		// 	setClients((prevClients) => [...prevClients, newChange]);
		// }

		if (loading) {
			console.log("Loading...");
		} else if (data) {
			console.log("All clients:", data);
			setClients(data.getAllClients); // Ensure this matches the structure from your GraphQL server
		} else if (error) {
			console.log("Error:", error);
		}
	}, [error, loading, data]); //newChange

	return (
		<div className="children_content">
			<h1>Clientes</h1>
			<input
				type="text"
				className="filterInput"
				placeholder="filtrar Por Nombre"
				onChange={(e) => setSearch(e.target.value)}
			></input>

			{loading ? (
				<h1>loading</h1>
			) : (
				<table>
					<tr className="tableHeader">
						{/* <th>
							<h2>ID </h2>
						</th> */}
						<th>
							<h2>Nombre </h2>
						</th>
						<th>
							<h2>Teléfono(s)</h2>
						</th>
						<th></th>
					</tr>
					{clients
						.filter(
							(c, idx) =>
								c?.clientName
									.toLowerCase()
									.includes(search.toLowerCase()) ||
								c?.clientLastName
									.toLowerCase()
									.includes(search.toLowerCase())
						)
						.map((c) => {
							return (
								<tr key={c?.id} className="data">
									{/* <td>
										<p className="idInfo">{c?.id}</p>
									</td> */}
									<td>
										<Link to={`/${c?.id}`}>
											<p className="getAllName">
												{c?.clientName +
													" " +
													c?.clientLastName}
											</p>
										</Link>
									</td>
									<td>
										<p>
											{/* {c?.cellPhone?.map((n, idx) => {
												return (
													<span key={idx}>
														<span>{n}</span> ,
													</span>
												);
											})} */}
											{c?.cellPhones[0]?.number}
										</p>
									</td>
								</tr>
							);
						})}
				</table>
			)}
		</div>
	);
}

export default GetAllClients; // Export the GetAllList component
