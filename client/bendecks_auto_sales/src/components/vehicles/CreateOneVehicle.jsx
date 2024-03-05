import { useState, useEffect, useRef } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";
import { create_one_vehicle } from "../../GraphQL/mutations/vehicleMutations";
import { get_all_vehicles } from "../../GraphQL/queries/vehicleQueries";

import io from "socket.io-client"; //importing socket.io-client

const CreateOneVehicle = ({ reload, setReload }) => {
	const [info, setInfo] = useState({
		// cellPhone: [{ number: "" }],
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
	const submit = async (e) => {
		e.preventDefault();

		await createOneVehicle({
			variables: {
				vehicleName: info?.vehicleName,
				vehicleModels: info?.vehicleModels,
				years: info?.years,
				colors: info?.colors,
				// boughtPrice: parseFloat(info.boughtPrice),
			},
			// this is re fetching the data
			refetchQueries: [{ query: get_all_vehicles }],
		})
			.then(async (res) => {
				let id = res.data.createOneVehicle.id;
				await navigate(`/vehicles/${id}`);

				await console.log(
					"here is the response",
					res.data.createOneVehicle
				);
				// socket.emit("new_client_added", res.data.createOneVehicle);
				// setReload(!reload);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	// const newSectionRef = useRef(null);
	// const [confirmDelete, setConfirmDelete] = useState(
	// 	Array(sections?.length).fill(false)
	// );
	const [sections, setSections] = useState([{ model: "" }]);
	const [sections2, setSections2] = useState([{ year: "" }]);
	const [sections3, setSections3] = useState([{ color: "" }]);

	const addSection = () => {
		setSections([...sections, { model: "" }]);
	};

	const handleInputChange = (e, index) => {
		const updatedSections = sections.map((section, secIndex) => {
			if (index === secIndex) {
				return { ...section, [e.target.name]: e.target.value };
			}
			return section;
		});
		setSections(updatedSections);
		setInfo({ ...info, vehicleModels: updatedSections });

		// Update the info.cellPhone with the cell phone numbers from all sections
		// const updatedColors = updatedSections.map((section) => section.color);
	};

	const deleteSection = (index) => {
		const filteredSections = sections.filter(
			(_, secIndex) => secIndex !== index
		);
		setSections(filteredSections);
	};

	const addSection2 = () => {
		setSections2([...sections2, { year: "" }]);
	};

	const handleInputChange2 = (e, index) => {
		const updatedSections = sections2.map((section2, secIndex) => {
			if (index === secIndex) {
				return { ...section2, [e.target.name]: e.target.value };
			}
			return section2;
		});
		setSections2(updatedSections);
		setInfo({ ...info, years: updatedSections });

		// Update the info.cellPhone with the cell phone numbers from all sections
		// const updatedColors = updatedSections.map((section) => section.color);
	};

	const deleteSection2 = (index) => {
		const filteredSections = sections2.filter(
			(_, secIndex) => secIndex !== index
		);
		setSections2(filteredSections);
	};

	const addSection3 = () => {
		setSections3([...sections3, { color: "" }]);
	};

	const handleInputChange3 = (e, index) => {
		const updatedSections = sections3.map((section3, secIndex) => {
			if (index === secIndex) {
				return { ...section3, [e.target.name]: e.target.value };
			}
			return section3;
		});
		setSections3(updatedSections);
		setInfo({ ...info, colors: updatedSections });
		// Update the info.cellPhone with the cell phone numbers from all sections
		// const updatedColors = updatedSections.map((section) => section.color);
	};

	const deleteSection3 = (index) => {
		const filteredSections = sections3.filter(
			(_, secIndex) => secIndex !== index
		);
		setSections3(filteredSections);
	};

	// const focusNewInput = () => {
	// 	if (newSectionRef.current) {
	// 		newSectionRef.current.focus();
	// 	}
	// };

	// const toggleConfirmDelete = (index) => {
	// 	setConfirmDelete((prevState) => {
	// 		const newState = [...prevState];
	// 		newState[index] = !newState[index];
	// 		return newState;
	// 	});
	// };

	// Component rendering
	return (
		<div className="children_content">
			<form onSubmit={submit} className="createOneClientForm">
				<div className="creteOneFullSection">
					<div>
						<input
							type="text"
							name="vehicleName"
							onChange={(e) => infoToBeSubmitted(e)}
							placeholder="Nombre Del Vehículo"
							className="createOneClientInput"
						/>
					</div>

					{sections.map((section, index) => (
						<div key={index} className="newSection">
							<input
								type="text"
								name="model"
								onChange={(e) => {
									handleInputChange(e, index);
								}}
								placeholder="Modelo Del Vehículo"
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
							onClick={() => addSection()}
							className="addSection"
						>
							<p>&#43;</p>
						</button>
					</div>

					{sections2.map((section2, index) => (
						<div key={index} className="newSection">
							<input
								type="text"
								name="year"
								onChange={(e) => {
									handleInputChange2(e, index);
								}}
								placeholder="Año"
								className="createOneClientInput space"
							/>
							{sections2.length > 1 && (
								<div>
									<button
										type="button"
										onClick={() => deleteSection2(index)}
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
							onClick={() => addSection2()}
							className="addSection"
						>
							<p>&#43;</p>
						</button>
					</div>

					{sections3.map((section3, index) => (
						<div key={index} className="newSection">
							<input
								type="text"
								name="color"
								onChange={(e) => {
									handleInputChange3(e, index);
								}}
								placeholder="Color"
								className="createOneClientInput space"
							/>
							{sections3.length > 1 && (
								<div>
									<button
										type="button"
										onClick={() => deleteSection3(index)}
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
							onClick={() => addSection3()}
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
