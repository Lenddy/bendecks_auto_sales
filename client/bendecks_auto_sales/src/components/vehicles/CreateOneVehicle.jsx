import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { create_one_vehicle } from "../../GraphQL/mutations/vehicleMutations";
import { get_all_vehicles } from "../../GraphQL/queries/vehicleQueries";

const CreateOneVehicle = () => {
	const [info, setInfo] = useState({});
	const [validations, setValidations] = useState(false);

	const navigate = useNavigate();

	// Apollo Client mutation hook for creating a single list item
	const [createOneVehicle] = useMutation(create_one_vehicle);

	// Function to handle input changes and update state accordingly
	const infoToBeSubmitted = e => {
		setInfo({
			...info,
			[e.target.name]: e.target.value,
		});
	};

	// Function to handle form submission
	const submit = async e => {
		e.preventDefault();

		await createOneVehicle({
			variables: {
				vehicleName: info?.vehicleName,
				vehicleModels: info?.vehicleModels,
				years: info?.years,
				colors: info?.colors,
			},
			// this is re fetching the data
			refetchQueries: [{ query: get_all_vehicles }],
		})
			.then(async res => {
				let id = res.data.createOneVehicle.id;
				await navigate(`/vehicles/${id}`);

				await console.log("here is the response", res.data.createOneVehicle);
				// socket.emit("new_client_added", res.data.createOneVehicle);
				// setReload(!reload);
			})
			.catch(() => {
				setValidations(true);
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

	const deleteSection = index => {
		const filteredSections = sections.filter((_, secIndex) => secIndex !== index);
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

	const deleteSection2 = index => {
		const filteredSections = sections2.filter((_, secIndex) => secIndex !== index);
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

	const deleteSection3 = index => {
		const filteredSections = sections3.filter((_, secIndex) => secIndex !== index);
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

	// {info?.vehicleName?.length > 0 &&
	// 	info?.vehicleName?.length < 2 ? (
	// 		<p className="input-validation">
	// 			Nombre Debe De Tener Por Lo Menos 2 Caracteres
	// 		</p>
	// 	) : validations ? (
	// 		<p className="input-validation">
	// 			El Nombre Es Requerido
	// 		</p>
	// 	) : null}

	// Component rendering
	return (
		<div className="children-content">
			<h1>Nuevo Cliente</h1>
			<form onSubmit={submit} className="form-create">
				<div className="form-section">
					<div>
						<input
							type="text"
							name="vehicleName"
							onChange={e => {
								infoToBeSubmitted(e);
								setValidations(false);
							}}
							placeholder="Nombre Del Vehículo"
							className="form-input"
						/>
						{info?.vehicleName?.length > 0 && info?.vehicleName?.length < 2 ? <p className="input-validation">Nombre Del Vehículo Debe De Tener Por Lo Menos 2 Caracteres</p> : validations ? <p className="input-validation">El Nombre Del Vehículo Es Requerido</p> : null}
					</div>

					{sections.map((section, index) => (
						<div key={index} className="form-new-input-container">
							<div className="form-new-input">
								<input
									type="text"
									name="model"
									onChange={e => {
										handleInputChange(e, index);
										setValidations(false);
									}}
									placeholder="Modelo Del Vehículo"
									className="form-input space"
								/>

								{sections.length > 1 && (
									<div>
										<button type="button" onClick={() => deleteSection(index)} className="form-delete-input-section">
											<p>&#8722;</p>
										</button>
									</div>
								)}
							</div>

							{sections[index].model?.length > 0 && sections[index].model?.length < 2 ? (
								<div className="form-validation-container">
									<p className="input-validation">El Modelo Del Vehículo Debe De Tener Por Lo Menos 2 Caracteres</p>
								</div>
							) : validations ? (
								<div className="form-validation-container">
									<p className="input-validation">El Modelo Es Requerido</p>
								</div>
							) : null}
						</div>
					))}

					<div className="form-new-section-btn-container">
						<button type="button" onClick={() => addSection()} className="form-add-input-section">
							<p>&#43;</p>
						</button>
					</div>

					{sections2.map((section2, index) => (
						<div key={index} className="form-new-input-container">
							<div className="form-new-input">
								<input
									type="number"
									name="year"
									onChange={e => {
										handleInputChange2(e, index);
										setValidations(false);
									}}
									placeholder="Año"
									className="form-input space"
								/>

								{sections2.length > 1 && (
									<div>
										<button type="button" onClick={() => deleteSection2(index)} className="form-delete-input-section">
											<p>&#8722;</p>
										</button>
									</div>
								)}
							</div>

							{sections2?.[index].year?.length > 0 && sections2?.[index].year?.length < 2 ? (
								<div className="form-validation-container">
									<p className="input-validation">Año Debe De Tener Por Lo Menos 2 Caracteres</p>
								</div>
							) : validations ? (
								<div className="form-validation-container">
									<p className="input-validation">El Año Es Requerido</p>
								</div>
							) : null}
						</div>
					))}

					<div className="form-new-section-btn-container">
						<button type="button" onClick={() => addSection2()} className="form-add-input-section">
							<p>&#43;</p>
						</button>
					</div>

					{sections3.map((section3, index) => (
						<div key={index} className="form-new-input-container">
							<div className="form-new-input">
								<input
									type="text"
									name="color"
									onChange={e => {
										handleInputChange3(e, index);
										setValidations(false);
									}}
									placeholder="Color"
									className="form-input space"
								/>

								{sections3.length > 1 && (
									<div>
										<button type="button" onClick={() => deleteSection3(index)} className="form-delete-input-section">
											<p>&#8722;</p>
										</button>
									</div>
								)}
							</div>

							{sections3?.[index].color?.length > 0 && sections3?.[index].color?.length < 2 ? (
								<div className="form-validation-container">
									<p className="input-validation">El Color Debe De Tener Por Lo Menos 2 Caracteres</p>
								</div>
							) : null}
						</div>
					))}

					<div className="form-new-section-btn-container">
						<button type="button" onClick={() => addSection3()} className="form-add-input-section">
							<p>&#43;</p>
						</button>
					</div>
				</div>

				<button type="submit" className={`form-submit-btn ${info?.vehicleName?.length >= 2 && info?.vehicleModels?.[0]?.model?.length >= 2 && info?.years?.[0]?.year.length >= 2 ? "show" : "hide"}`}>
					Agregar Vehículo
				</button>
			</form>
		</div>
	);
};

export default CreateOneVehicle;
