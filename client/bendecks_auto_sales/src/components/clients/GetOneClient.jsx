// Import necessary modules from Apollo Client and custom GraphQL queries
import { useQuery } from "@apollo/client"; // Import useQuery hook to execute GraphQL queries
import { useNavigate, Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { get_one_client } from "../../GraphQL/queries/clientQueries";

function GetOneClient() {
	const { id } = useParams();

	// Fetch data using the useQuery hook by executing the getAllList query
	const { error, loading, data } = useQuery(get_one_client, {
		variables: { id },
	});

	// Set up state to manage the lists fetched from the query
	const [client, setClient] = useState();

	// useEffect hook to handle changes in error, loading, and data states
	useEffect(() => {
		if (loading) {
			console.log("loading"); // Log a message when data is loading
		}
		if (data) {
			console.log(data); // Log the fetched data
			setClient(data.getOneClient); // Set the lists retrieved from the query to the state
		}
		if (error) {
			console.log("there was an error", error); // Log an error message if an error occurs
		}
	}, [error, loading, data]); // Dependencies for the useEffect hook

	// Render the retrieved lists
	return (
		<div>
			<Link to={"/dashboard"}>
				<button>dashboard</button>
			</Link>

			<h1> ID: {client?.id}</h1>
			<p>
				{" "}
				Full Name: {client?.clientName} {client?.clientLastName}
			</p>
			<p>
				Phone NUmber:{" "}
				{client?.cellPhone.map((n, idx) => {
					return (
						<span key={idx}>
							<span>{n}</span> ,
						</span>
					);
				})}
			</p>
			<Link to={`/${client?.id}`}>
				<button>view</button>
			</Link>
			<Link to={`/update/${client?.id}`}>
				<button>update</button>
			</Link>
			<Link to={`/delete${client?.id}`}>
				<button>delete</button>
			</Link>
		</div>
	);
}

export default GetOneClient; // Export the GetAllList component

// {list.map((l, idx) => {})}
