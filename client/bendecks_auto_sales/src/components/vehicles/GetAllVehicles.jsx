// Import necessary modules from Apollo Client and custom GraphQL queries
import { useQuery, useSubscription } from "@apollo/client"; // Import useQuery hook to execute GraphQL queries

import { useNavigate, Link } from "react-router-dom";

import { useState, useEffect } from "react";
import { get_all_vehicles } from "../../GraphQL/queries/vehicleQueries";
import io from "socket.io-client"; //importing socket.io-client

// !!! make a funtion that has a loop that makes more of a tag so that uses can add more than on e number ,color

function GetAllVehicles() {
	const [socket] = useState(() => io(":8080")); //connect to the server
	const navigate = useNavigate();
	const navigateTO = (url) => {
		navigate(url);
	};

	// Fetch data using the useQuery hook by executing the getAllVehicles query
	const { error, loading, data } = useQuery(get_all_vehicles);

	// Set up state to manage the Clients fetched from the query
	const [vehicles, setVehicles] = useState([]);

	// Handle subscription using useSubscription hook
	// const { data: subscriptionData } = useSubscription(
	// 	client_added_subscription
	// );

	// useEffect(() => {
	// 	socket.on("reload_client_list", (newClientInfo) => {
	// 		setClients((prevClients) => [...prevClients, newClientInfo]);
	// 		clients;
	// 	});
	// 	console.log(clients);

	// 	return () => {
	// 		socket.off("reload_client_list"); // Clean up the socket listener on unmount
	// 	};
	// }, [socket]); // Listen to socket changes

	// useEffect hook to handle changes in error, loading, and data states
	useEffect(() => {
		if (loading) {
			console.log("loading"); // Log a message when data is loading
		}
		if (data) {
			console.log(data.getAllVehicles); // Log the fetched data
			setVehicles(data.getAllVehicles); // Set the Clients retrieved from the query to the state
		}
		if (error) {
			console.log("there was an error", error); // Log an error message if an error occurs
		}
	}, [error, loading, data, vehicles]); // Dependencies for the useEffect hook

	// Render the retrieved clients

	return (
		<div>
			<button onClick={() => navigateTO("/createOneVehicle")}>
				{" "}
				add one vehicle
			</button>

			{vehicles.map((v) => {
				return (
					<div key={v?.id}>
						<h1> ID: {v?.id}</h1>
						<p>
							{" "}
							Name and Model : {v?.vehicleName} {v?.vehicleModel}
						</p>
						<p>year: {v?.year}</p>
						<p>
							color(s):{" "}
							{v?.color.map((c, idx) => {
								return (
									<span key={idx}>
										<span>{c}</span> ,
									</span>
								);
							})}
						</p>
						<Link to={`/vehicles/${v.id}`}>
							<button>view</button>
						</Link>
						<Link to={`/vehicles/update/${v?.id}`}>
							<button>update</button>
						</Link>
						<Link to={`/vehicles/delete/${v?.id}`}>
							<button>delete</button>
						</Link>
					</div>
				);
			})}
		</div>
	);
}

export default GetAllVehicles; // Export the GetAllList component
