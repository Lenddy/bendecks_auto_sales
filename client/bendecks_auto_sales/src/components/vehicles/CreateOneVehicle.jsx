import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";
import { create_one_vehicle } from "../../GraphQL/mutations/vehicleMutations";
import { get_all_vehicles } from "../../GraphQL/queries/vehicleQueries";

import io from "socket.io-client"; //importing socket.io-client

// !!! make a funtion that has a loop that makes more of a tag so that uses can add more than on e number ,color

const CreateOneVehicle = ({ reload, setReload }) => {
	// const [socket] = useState(() => io(":8080")); //connect to the server

	// socket.on("new_connection", (data) => {
	// 	console.log(data);
	// });

	// State to manage form data
	// Dependencies for the useEffect hook
	const [info, setInfo] = useState({
		// title: "",
		// description: "",
		// isDone: false,
		// cellPhone: [],
		color: [],
	});

	const navigate = useNavigate();

	// Apollo Client mutation hook for creating a single list item
	const [createOneVehicle, { error }] = useMutation(create_one_vehicle);

	// Function to handle input changes and update state accordingly
	const infoToBeSubmitted = (e) => {
		setInfo({
			...info,
			[e.target.name]: e.target.value,
		});
	};

	// Function to handle form submission
	const submit = (e) => {
		e.preventDefault(); // Prevent default form submission behavior
		console.log("hello there");
		createOneVehicle({
			variables: {
				vehicleName: info.vehicleName,
				vehicleModel: info.vehicleModel,
				year: info.year,
				color: [info.color],
				boughtPrice: parseFloat(info.boughtPrice),
			},
			// this is re fetching the data
			refetchQueries: [{ query: get_all_vehicles }],
		})
			.then((res) => {
				// Reset the form fields after successful submission

				// setInfo({
				// 	// title: "",
				// 	// description: "",
				// 	// isDone: false,
				// 	cellPhone: [],
				// });
				navigate("/vehicles");
				console.log("here is the response", res.data.createOneVehicle);
				// socket.emit("new_client_added", res.data.createOneVehicle);
				// setReload(!reload);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	// Component rendering
	return (
		<div>
			<Link to={"/vehicles"}>
				<button style={{ margin: "5px" }}>view clients</button>
			</Link>
			<form onSubmit={submit}>
				<div>
					<label htmlFor="vehicleName">Vehicle Name:</label>
					<input
						type="text"
						name="vehicleName"
						onChange={infoToBeSubmitted}
						// value={info.clientName}
					/>
				</div>
				<div>
					<label htmlFor="vehicleModel">Vehicle Model:</label>
					<input
						name="vehicleModel"
						onChange={infoToBeSubmitted}
						// value={info.clientLastName}
					></input>
				</div>
				<div>
					<label htmlFor="year">Year:</label>
					<input
						type="text"
						name="year"
						onChange={infoToBeSubmitted}
						// value={info.cellPhone}
					/>
				</div>
				<div>
					<label htmlFor="color">Color:</label>
					<input
						type="text"
						name="color"
						onChange={infoToBeSubmitted}
						// value={info.cellPhone}
					/>
				</div>

				<div>
					<label htmlFor="boughtPrice">Bought Price:</label>
					<input
						type="number"
						name="boughtPrice"
						onChange={infoToBeSubmitted}
						// value={info.cellPhone}
					/>
				</div>
				<button type="submit">Add a new vehicle</button>
			</form>
		</div>
	);
};

export default CreateOneVehicle;
