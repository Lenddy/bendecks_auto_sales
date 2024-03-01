// Import necessary modules from Apollo Client and custom GraphQL queries
import { useQuery, useSubscription } from "@apollo/client"; // Import useQuery hook to execute GraphQL queries

import { useNavigate, Link } from "react-router-dom";

import { useState, useEffect } from "react";
import { get_all_vehicles } from "../../GraphQL/queries/vehicleQueries";

import { VEHICLE_CHANGE_SUBSCRIPTION } from "../../GraphQL/subscriptions/subscriptions";

function GetAllVehicles() {
	const navigate = useNavigate();
	const navigateTO = (url) => {
		navigate(url);
	};

	// Fetch data using the useQuery hook by executing the getAllVehicles query
	const { error, loading, data } = useQuery(get_all_vehicles);

	// Set up state to manage the Clients fetched from the query
	const [vehicles, setVehicles] = useState([]);

	// !!!!!!!!!!!!!!!!!!!!!!!!!!   find out why the subsciption is not updating the info on the page for others
	// Subscription for client changes
	useSubscription(VEHICLE_CHANGE_SUBSCRIPTION, {
		onData: (infoChange) => {
			console.log("this the vehicle subscription :", infoChange);
			// const changeInfo = infoChange?.data?.data?.onVehicleChange;
			// const { eventType, vehicleChanges } = changeInfo;
			// console.log("New data from vehicle subscription:", changeInfo);

			// if (eventType === "VEHICLE_ADDED") {
			// 	// Handle new client addition
			// 	console.log("added hit");
			// 	setVehicles((prev) => [...prev, vehicleChanges]);
			// } else if (eventType === "VEHICLE_UPDATED") {
			// 	console.log("updated hit");
			// 	// Handle client update
			// 	setVehicles((prev) =>
			// 		prev.map((v) =>
			// 			v.id === vehicleChanges.id ? vehicleChanges : v
			// 		)
			// 	);
			// } else if (eventType === "VEHICLE_DELETED") {
			// 	console.log("delete hit");
			// 	// Handle client deletion
			// 	setVehicles((prev) =>
			// 		prev.filter((v) => v.id !== vehicleChanges.id)
			// 	);
			// } else {
			// 	console.log("Unknown event type");
			// }
			// eventType;
			// clientChanges;

			// setNewChange(changeClient);
			// setClients((prevClients) => [...prevClients, newChange]);
		},
	});

	// useEffect hook to handle changes in error, loading, and data states
	useEffect(() => {
		if (loading) {
			console.log("loading"); // Log a message when data is loading
		}
		if (data) {
			console.log(data); // Log the fetched data
			setVehicles(data.getAllVehicles); // Set the Clients retrieved from the query to the state
		}
		if (error) {
			console.log("there was an error", error); // Log an error message if an error occurs
		}
	}, [error, loading, data]); // Dependencies for the useEffect hook

	// Render the retrieved clients
	const [search, setSearch] = useState("");

	return (
		<div className="children_content">
			<input
				type="text"
				className="filterInput"
				placeholder="filtrar Por Nombre"
				onChange={(e) => setSearch(e.target.value)}
			></input>

			<table>
				<tr className="tableHeader">
					<th>
						<h2>Nombre/Modelo</h2>
					</th>
					<th>
						<h2>color</h2>
					</th>
				</tr>
				{vehicles
					.filter(
						(v, idx) =>
							v?.vehicleName

								.toLowerCase()
								.includes(search.toLowerCase()) ||
							v?.vehicleModel
								.toLowerCase()
								.includes(search.toLowerCase())
					)
					.map((v) => {
						return (
							<tr key={v?.id} className="data">
								{/* <td>
										<p className="idInfo">{c?.id}</p>
									</td> */}
								<td>
									<Link to={`/vehicles/${v?.id}`}>
										<p className="getAllName">
											{v?.vehicleName +
												" " +
												v?.vehicleModel}
										</p>
									</Link>
								</td>
								<td>
									{/* <p>{v?.colors[0]}</p> */}
									colors
								</td>
							</tr>
						);
					})}
			</table>
		</div>
	);
}

export default GetAllVehicles;
