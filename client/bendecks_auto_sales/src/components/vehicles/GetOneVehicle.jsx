// Import necessary modules from Apollo Client and custom GraphQL queries
import { useQuery } from "@apollo/client"; // Import useQuery hook to execute GraphQL queries
import { useNavigate, Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { get_one_vehicle } from "../../GraphQL/queries/vehicleQueries";

function GetOneVehicle() {
	const { id } = useParams();

	// Fetch data using the useQuery hook by executing the getAllList query
	const { error, loading, data } = useQuery(get_one_vehicle, {
		variables: { id },
	});

	// Set up state to manage the lists fetched from the query
	const [vehicle, setVehicle] = useState({});

	// useEffect hook to handle changes in error, loading, and data states
	useEffect(() => {
		if (loading) {
			console.log("loading"); // Log a message when data is loading
		}
		if (data) {
			console.log(data.getOneVehicle); // Log the fetched data
			setVehicle(data.getOneVehicle); // Set the lists retrieved from the query to the state
		}
		if (error) {
			console.log("there was an error", error); // Log an error message if an error occurs
		}
	}, [error, loading, data, vehicle]); // Dependencies for the useEffect hook

	// Render the retrieved lists
	return (
		<div>
			<Link to={"/dashboard"}>
				<button>dashboard</button>
			</Link>

			<h1> ID: {vehicle?.id}</h1>
			<p>
				{" "}
				Name and Model : {vehicle?.vehicleName} {vehicle?.vehicleModel}
			</p>
			<p>year: {vehicle?.year}</p>
			<p>
				color(s):{" "}
				{vehicle?.color?.map((c, idx) => {
					return (
						<span key={idx}>
							<span>{c}</span> ,
						</span>
					);
				})}
			</p>
			<Link to={`/vehicles/${vehicle.id}`}>
				<button>view</button>
			</Link>
			<Link to={`/vehicles/update/${vehicle?.id}`}>
				<button>update</button>
			</Link>
			<Link to={`/vehicles/delete/${vehicle?.id}`}>
				<button>delete</button>
			</Link>
		</div>
	);
}

export default GetOneVehicle;
