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
				vehicleName: info?.vehicleName,
				vehicleModel: info?.vehicleModel,
				year: info?.year,
				color: info?.color,
				// boughtPrice: parseFloat(info.boughtPrice),
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

	const [sections, setSections] = useState([{ color: "" }]);

	const addSection = () => {
		setSections([...sections, { color: "" }]);
	};

	const handleInputChange = (e, index) => {
		const updatedSections = sections.map((section, secIndex) => {
			if (index === secIndex) {
				return { ...section, [e.target.name]: e.target.value };
			}
			return section;
		});
		setSections(updatedSections);

		// Update the info.cellPhone with the cell phone numbers from all sections
		const updatedColors = updatedSections.map((section) => section.color);
		setInfo({ ...info, color: updatedColors });
	};

	const deleteSection = (index) => {
		const filteredSections = sections.filter(
			(_, secIndex) => secIndex !== index
		);
		setSections(filteredSections);
	};

	// Component rendering
	return (
		<div className="children_content">
			<form onSubmit={submit} className="createOneClientForm">
				<div className="creteOneFullSection">
					<div>
						<input
							type="text"
							name="vehicleName"
							onChange={infoToBeSubmitted}
							placeholder="vehicle Name"
							className="createOneClientInput"
							// value={info.clientName}
						/>
					</div>
					<div>
						<input
							name="vehicleModel"
							onChange={infoToBeSubmitted}
							placeholder="Vehicle Model"
							className="createOneClientInput"
							// value={info.clientLastName}
						></input>
					</div>
					<div>
						<input
							type="text"
							name="year"
							onChange={infoToBeSubmitted}
							placeholder="Year"
							className="createOneClientInput"
							// value={info.cellPhone}
						/>
					</div>
					{sections.map((section, index) => (
						<div key={index} className="newSection">
							<input
								type="text"
								name="color"
								value={section.color}
								onChange={(e) => {
									handleInputChange(e, index);
									// infoToBeSubmitted(e);
								}}
								placeholder="Color"
								className="createOneClientInput space"
							/>
							{sections.length > 1 && (
								<div>
									<button
										type="button"
										onClick={() => deleteSection(index)}
										className="deleteSection"
									>
										<p>&#8722;</p>
									</button>
								</div>
							)}
						</div>
					))}
					<div className="btnNewSection">
						<button
							type="button"
							onClick={addSection}
							className="addSection"
						>
							<p>&#43;</p>
						</button>
					</div>
				</div>
				<button type="submit" className="submit_btn">
					Agregar Vehículo
				</button>
			</form>
		</div>
	);
};

export default CreateOneVehicle;
