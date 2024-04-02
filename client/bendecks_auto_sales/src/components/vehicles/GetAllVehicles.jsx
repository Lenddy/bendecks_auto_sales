// Import necessary modules from Apollo Client and custom GraphQL queries
import { useQuery, useSubscription } from "@apollo/client"; // Import useQuery hook to execute GraphQL queries
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { get_all_vehicles } from "../../GraphQL/queries/vehicleQueries";

import { VEHICLE_CHANGE_SUBSCRIPTION } from "../../GraphQL/subscriptions/subscriptions";

function GetAllVehicles() {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const { error, loading, data, refetch } = useQuery(get_all_vehicles); // Fetch data using the useQuery hook by executing the getAllVehicles query
	const [vehicles, setVehicles] = useState([]); // Set up state to manage the Clients fetched from the query
	const [search, setSearch] = useState(""); // Render the retrieved clients

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};
		window.addEventListener("resize", handleResize);
		// Cleanup
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []); // Empty dependency array ensures that this effect runs only once on mount

	// useEffect hook to handle changes in error, loading, and data states
	useEffect(() => {
		if (loading) {
			// console.log("loading"); // Log a message when data is loading
		}
		if (data) {
			console.log(data); // Log the fetched data
			setVehicles(data.getAllVehicles); // Set the Clients retrieved from the query to the state
		}
		if (error) {
			// console.log("there was an error", error); // Log an error message if an error occurs
		}
		const fetchData = async () => {
			await refetch();
		};
		fetchData();
	}, [error, loading, data, refetch]); // Dependencies for the useEffect hook

	// Subscription for client changes
	useSubscription(VEHICLE_CHANGE_SUBSCRIPTION, {
		onData: infoChange => {
			// console.log("this the vehicle subscription :", infoChange);
			const changeInfo = infoChange?.data?.data?.onVehicleChange;
			const { eventType, vehicleChanges } = changeInfo;
			// console.log("New data from vehicle subscription:", changeInfo);

			if (eventType === "VEHICLE_ADDED") {
				// Handle new client addition
				// console.log("added hit");
				setVehicles(prev => [...prev, vehicleChanges]);
			} else if (eventType === "VEHICLE_UPDATED") {
				// console.log("updated hit");
				// Handle client update
				setVehicles(prev => prev.map(v => (v.id === vehicleChanges.id ? vehicleChanges : v)));
			} else if (eventType === "VEHICLE_DELETED") {
				// console.log("delete hit");
				// Handle client deletion
				setVehicles(prev => prev.filter(v => v.id !== vehicleChanges.id));
			}
		},
	});

	return (
		<div className="children-content">
			<h1>Vehículos</h1>
			<input type="text" className="filter" placeholder="filtrar Por Nombre" onChange={e => setSearch(e.target.value)} />

			<table>
				<thead>
					<tr className="table-header">
						{windowWidth > 500 ? (
							<th>
								<h2>ID</h2>
							</th>
						) : null}
						<th>
							<h2>Nombre</h2>
						</th>
						<th>
							<h2>Modelos Disponibles</h2>
						</th>
					</tr>
				</thead>
				<tbody>
					{vehicles
						.filter(v => v?.vehicleName?.toLowerCase()?.includes(search?.toLowerCase()))
						.map(v => {
							return (
								<tr key={v?.id} className="table-data">
									{windowWidth > 500 ? (
										<td>
											<Link to={`/vehicles/${v?.id}`}>
												<p className="link-connection">{v?.id}</p>
											</Link>
										</td>
									) : null}
									<td>
										<Link to={`/vehicles/${v?.id}`}>
											<p className="link-connection">{v?.vehicleName}</p>
										</Link>
									</td>
									<td>
										<p>{v?.vehicleModels?.length}</p>
									</td>
								</tr>
							);
						})}
				</tbody>
			</table>
		</div>
	);
}

export default GetAllVehicles;
