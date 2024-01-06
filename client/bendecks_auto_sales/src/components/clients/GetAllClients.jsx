// Import necessary modules from Apollo Client and custom GraphQL queries
import { useQuery } from "@apollo/client"; // Import useQuery hook to execute GraphQL queries

import { useNavigate, Link, useParams } from "react-router-dom";

import { useState, useEffect } from "react";
import { get_all_clients } from "../../GraphQL/queries/clientQueries";

function GetAllClients({ reload }) {
	const navigate = useNavigate();
	const navigateTO = (url) => {
		navigate(url);
	};

	// use promisees to get all the data

	// Fetch data using the useQuery hook by executing the getAllClients query
	const { error, loading, data } = useQuery(get_all_clients);

	// Set up state to manage the Clients fetched from the query
	const [clients, setClients] = useState([]);

	// useEffect hook to handle changes in error, loading, and data states
	useEffect(() => {
		if (loading) {
			console.log("loading"); // Log a message when data is loading
		}
		if (data) {
			console.log(data); // Log the fetched data
			setClients(data.getAllClients); // Set the Clients retrieved from the query to the state
		}
		if (error) {
			console.log("there was an error", error); // Log an error message if an error occurs
		}
	}, [error, loading, data, clients, reload]); // Dependencies for the useEffect hook

	// Render the retrieved clients
	return (
		<div>
			<button onClick={() => navigateTO("/createOneClient")}>
				{" "}
				add one Client
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
							Phone NUmber:{" "}
							{c?.cellPhone.map((n, idx) => {
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
						<Link to={`/delete${c?.id}`}>
							<button>delete</button>
						</Link>
					</div>
				);
			})}
		</div>
	);
}

export default GetAllClients; // Export the GetAllList component
