// Import necessary modules from Apollo Client and custom GraphQL queries
import { useQuery, useSubscription } from "@apollo/client"; // Import useQuery hook to execute GraphQL queries

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

	// Set up state to manage the Clients fetched from the query
	const [clients, setClients] = useState([]);
	const [newClient, setNewClient] = useState();

	// Handle subscription using useSubscription hook
	const subscription = useSubscription(CLIENT_CHANGE_SUBSCRIPTION, {
		onData: (newChange) => {
			const newClient = newChange.data.data.onClientChange;
			console.log("i got the new data on the sub", newClient);
			setNewClient(newClient);
		},
	});

	// useEffect hook to handle changes in error, loading, and data states
	useEffect(() => {
		console.log("the component render");
		if (loading) {
			console.log("loading");
		} else if (data) {
			console.log("all clients: ", data);
			setClients(data.getAllClients);
		} else if (error) {
			console.log("there was an error", error);
		}
	}, [error, loading, data]);

	// Handle new client from subscription
	useEffect(() => {
		if (newClient) {
			setClients((prevClients) => [...prevClients, newClient]);
			console.log("client was updated", clients);
		}
	}, [newClient, clients]);

	return (
		<div>
			<button
				style={{ margin: "5px" }}
				onClick={() => navigateTO("/createOneClient")}
			>
				{" "}
				add one Client
			</button>

			<button
				style={{ margin: "5px" }}
				onClick={() => navigateTO("/deals")}
			>
				{" "}
				view deals
			</button>

			<button
				style={{ margin: "5px" }}
				onClick={() => navigateTO("/vehicles")}
			>
				{" "}
				view vehicles
			</button>

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
						<Link to={`/${c.id}`}>
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
