import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams, Link } from "react-router-dom";
import { get_one_vehicle } from "../../GraphQL/queries/vehicleQueries";
import { update_One_vehicle } from "../../GraphQL/mutations/vehicleMutations";
import { get_all_vehicles } from "../../GraphQL/queries/vehicleQueries";
import { delete_one_vehicle } from "../../GraphQL/mutations/vehicleMutations";

const GetOneVehicle = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [info, setInfo] = useState({});
	const [vehicle, setVehicle] = useState();
	const [notFound, setNotFound] = useState(false);
	const [clientDelete, setClientDelete] = useState(false);

	const [focus, setFocus] = useState(false);

	const [sections, setSections] = useState();

	const [vehicleModelUpdate, setVehicleModelUpdate] = useState([]);
	const [confirmDelete, setConfirmDelete] = useState(
		Array(sections?.length).fill(false)
	);
	const newSectionRef = useRef(null);

	const { error, loading, data } = useQuery(get_one_vehicle, {
		variables: { id },
	});

	const [updateOneVehicle] = useMutation(update_One_vehicle);

	useEffect(() => {
		if (!loading && data) {
			setVehicle(data.getOneVehicle);
		}
	}, [loading, data]);

	const infoToBeSubmitted = (e) => {
		setInfo({
			...info,
			[e.target.name]: e.target.value,
		});
	};

	const submit = (e) => {
		e.preventDefault();

		updateOneVehicle({
			variables: {
				id,
				vehicleName: info.vehicleName,
				vehicleModels: info.vehicleModels,
				years: info.years,
				colors: info.colors,
				// boughtPrice: parseFloat(info.boughtPrice),
			},
			// this is re fetching the data
			refetchQueries: [{ query: get_all_vehicles }],
		})
			.then((res) => {
				console.log(res.data);
				navigate(`/vehicles/${id}`);
			})
			.catch((error) => {
				console.log("there was an error", error);
			});
	};

	// useEffect hook to handle changes in error, loading, and data states
	useEffect(() => {
		if (loading) {
			console.log("loading"); // Log a message when data is loading
		}
		if (data) {
			console.log(data); // Log the fetched data
			setVehicle(data.getOneVehicle); // Set the lists retrieved from the query to the state
			setSections(vehicle?.vehicleModels);
		}
		if (error) {
			console.log("there was an error", error); // Log an error message if an error occurs
			setNotFound(true);
		}
	}, [error, loading, data, vehicle]); // Dependencies for the useEffect hook

	const addSection = () => {
		const newSection = {
			modelId: Date.now(), // Generate a unique timestamp as the numberId
			model: "", // Initial content is empty
			status: "add", // Status for adding
		};
		setVehicleModelUpdate([...vehicleModelUpdate, newSection]);
		setSections((prevSections) => [...prevSections, newSection]);
	};

	const changeSectionVal = (e, index) => {
		let objectExists = false;

		const { __typename, modelId, ...sectionWithoutTypename } =
			sections[index];

		const itemUpdate = vehicleModelUpdate.map((item) => {
			if (item.status === "add" && item.modelId === modelId) {
				objectExists = true;
				return {
					modelId: item.modelId,
					model: e.target.textContent,
					status: "add",
				};
			}

			if (
				item.modelId === modelId &&
				item.modelId !== undefined &&
				item.status !== "add"
			) {
				objectExists = true;
				return {
					modelId: item.modelId,
					model: e.target.textContent,
					status: "update",
				};
			}

			if (item.status === "add" && item.modelId === modelId) {
				objectExists = true;
			}
			return item;
		});

		if (!objectExists) {
			itemUpdate.push({
				modelId,
				model: e.target.textContent,
				status: "update",
			});
		}

		setVehicleModelUpdate(itemUpdate);
	};

	const deleteSection = (index) => {
		const filteredSections = sections.filter(
			(_, secIndex) => secIndex !== index
		);
		setSections(filteredSections);

		const filterConfirmDelete = confirmDelete.filter(
			(_, deletedIndex) => deletedIndex !== index
		);
		setConfirmDelete(filterConfirmDelete);

		// Check if section exists in numberUpdate
		let objectExists = false;
		const itemUpdate = vehicleModelUpdate.map((item) => {
			if (item.id === index) {
				objectExists = true;
				return { ...item, status: "delete" }; // Update status to "delete"
			}
			return item;
		});

		// If section doesn't exist, add it to numberUpdate
		if (!objectExists) {
			const { __typename, ...sectionWithoutTypename } = sections[index]; // Destructure __typename and get the rest of the properties
			const deletedSection = {
				...sectionWithoutTypename,
				status: "delete",
			}; // Create a new object without __typename and with status field
			itemUpdate.push(deletedSection); // Add to numberUpdate
		}
		setVehicleModelUpdate(itemUpdate); // Update numberUpdate state
		setFocus(true);
	};

	// const changeSectionVal = (e, index) => {
	// 	let objectExists = false;

	// 	const { __typename, numberId, ...sectionWithoutTypename } =
	// 		sections[index];

	// 	const updatedNumberUpdate = numberUpdate.map((item) => {
	// 		if (item.status === "add" && item.numberId === numberId) {
	// 			objectExists = true;
	// 			return {
	// 				numberId: item.numberId,
	// 				number: e.target.textContent,
	// 				status: "add",
	// 			};
	// 		}

	// 		if (
	// 			item.numberId === numberId &&
	// 			item.numberId !== undefined &&
	// 			item.status !== "add"
	// 		) {
	// 			objectExists = true;
	// 			return {
	// 				numberId: item.numberId,
	// 				number: e.target.textContent,
	// 				status: "update",
	// 			};
	// 		}

	// 		if (item.status === "add" && item.numberId === numberId) {
	// 			objectExists = true;
	// 		}
	// 		return item;
	// 	});

	// 	if (!objectExists) {
	// 		updatedNumberUpdate.push({
	// 			numberId,
	// 			number: e.target.textContent,
	// 			status: "update",
	// 		});
	// 	}

	// 	setNumberUpdate(updatedNumberUpdate);
	// };

	const toggleConfirmDelete = (index) => {
		setConfirmDelete((prevState) => {
			const newState = [...prevState];
			newState[index] = !newState[index];
			return newState;
		});
	};

	const [deleteOneClient] = useMutation(
		delete_one_vehicle
		// 	 {
		// 	update(cache, { data: { deleteItem } }) {
		// 		cache.modify({
		// 			fields: {
		// 				allItems(existingItems, { readField }) {
		// 					return existingItems.filter(itemRef => readField('id', itemRef) !== deleteItem.id);
		// 				}
		// 			}
		// 		});
		// 	}
		// }
	);
	const deleteClient = () => {
		deleteOneClient({
			variables: {
				id, // Only pass the ID to the deletion mutation
			},
			refetchQueries: [{ query: get_one_vehicle }],
		})
			.then(() => {
				// Redirect after successful deletion
				navigate("/dashboard");
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const focusNewInput = () => {
		if (newSectionRef.current) {
			newSectionRef.current.focus();
		}
	};
	//! fix this  you should make it work like the get one in clients

	return (
		<div className="getOne">
			{notFound ? (
				<div>
					<h1 className="notFound">
						cliente con ID:<span>{id}</span> no se pudo encontrara
						asegúrese de que seal el id correcto
					</h1>

					<button onClick={() => navigate("/vehicles")}>
						regresar
					</button>
				</div>
			) : (
				<div className="oneInfo">
					<h1 className="notFound">{id}</h1>
					<form onSubmit={submit} className="getOneForm">
						<div className="section_union">
							<div>
								<h1
									contentEditable
									suppressContentEditableWarning
									name="vehicleName"
									onInput={infoToBeSubmitted}
									className="editableField "
									onFocus={() => setFocus(true)}
									// onBlur={() => setFocus(false)}
								>
									{vehicle?.vehicleName}
								</h1>
							</div>
						</div>
						{sections?.length > 0 ? (
							sections.map((model, index) => (
								<div
									key={model?.modelId}
									className="editablePhoneSection"
								>
									{index === sections.length - 1 ? (
										<h1
											contentEditable
											suppressContentEditableWarning
											name={`vehicle-${index}`}
											onInput={(e) => {
												changeSectionVal(e, index);
											}}
											onFocus={() => setFocus(true)}
											// onBlur={() => setFocus(false)}
											className="editableField"
											ref={
												index === sections.length - 1
													? newSectionRef
													: null
											}
											key={index}
										>
											{model?.model}
										</h1>
									) : (
										<h1
											contentEditable
											suppressContentEditableWarning
											className="editableField"
											name={`vehicle-${index}`}
											onInput={(e) => {
												changeSectionVal(e, index);
											}}
											onFocus={() => setFocus(true)}
											// onBlur={() => setFocus(false)}
										>
											{model?.model}
										</h1>
									)}

									{sections.length > 1 && (
										<div>
											{!confirmDelete[index] ? (
												<button
													type="button"
													className="deleteSection -update"
													onClick={() =>
														toggleConfirmDelete(
															index
														)
													}
													key={index}
												>
													<p>&#8722;</p>
												</button>
											) : (
												<div className="confirmDeletionsSection -update">
													<div className="btnNewSection">
														<button
															type="button"
															onClick={() =>
																deleteSection(
																	index
																)
															}
															className="deleteSection"
															key={index}
														>
															<p> &#10003;</p>
														</button>
													</div>

													<div className="btnNewSection">
														<button
															type="button"
															onClick={() =>
																toggleConfirmDelete(
																	index
																)
															}
															className="deleteSection"
															key={index}
														>
															<p> &#10005;</p>
														</button>
													</div>
												</div>
											)}
										</div>
									)}
								</div>
							))
						) : (
							<div className="editablePhoneSection">
								<h1
									contentEditable
									suppressContentEditableWarning
									name={`vehicle-0`}
									onInput={(e) => {
										changeSectionVal(e, 0);
									}}
									// onChange={infoToBeSubmitted}
									className="editableField"
								>
									{vehicle?.vehicleModels[0]?.model}
								</h1>
							</div>
						)}
						{/* it goes here */}
						<div className="btnNewSection">
							<button
								type="button"
								onClick={async () => {
									await addSection(), focusNewInput();
								}}
								className="addSection"
							>
								<p>&#43;</p>
							</button>
						</div>

						<div className="submitSection">
							<button
								type="submit"
								className={`submit_btn ${
									focus ? "show" : "hide"
								}`}
							>
								Actualizar Cliente
							</button>

							{clientDelete === false ? (
								<button
									type="button"
									className={`submit_btn`}
									onClick={() => setClientDelete(true)}
								>
									Borrar Cliente
								</button>
							) : (
								<div className="confirmDeleteCLient">
									<div className="btnNewSection">
										<button
											type="button"
											onClick={() => deleteClient()}
											className="deleteSection"
										>
											<p> &#10003;</p>
										</button>
									</div>

									<div className="btnNewSection">
										<button
											type="button"
											onClick={() =>
												setClientDelete(false)
											}
											className="deleteSection"
										>
											<p> &#10005;</p>
										</button>
									</div>
								</div>
							)}
						</div>
					</form>
				</div>
			)}
		</div>
	);
};

export default GetOneVehicle;

// {notFound ? (
// 	<h1 className="notFound">
// 		vehículo con ID:<span>{id}</span> no se pudo encontrara
// 		asegúrese de que seal el id correcto
// 	</h1>
// ) : (
// 	<div>
// 		<Link to={"/vehicles"}>
// 			<button style={{ margin: "5px" }}>view vehicles</button>
// 		</Link>
// 		<form onSubmit={submit}>
// 			<div>
// 				<label htmlFor="vehicleName">Vehicle Name:</label>
// 				<input
// 					type="text"
// 					name="vehicleName"
// 					onChange={infoToBeSubmitted}
// 					placeholder={vehicle.vehicleName}
// 					// value={info.clientName}
// 				/>
// 			</div>
// 			<div>
// 				<label htmlFor="vehicleModel">Vehicle Model:</label>
// 				<input
// 					name="vehicleModel"
// 					onChange={infoToBeSubmitted}
// 					placeholder={vehicle.vehicleModel}
// 					// value={info.clientLastName}
// 				></input>
// 			</div>
// 			<div>
// 				<label htmlFor="year">Year:</label>
// 				<input
// 					type="text"
// 					name="year"
// 					onChange={infoToBeSubmitted}
// 					placeholder={vehicle.year}
// 					// value={info.cellPhone}
// 				/>
// 			</div>
// 			<div>
// 				<label htmlFor="color">Color:</label>
// 				<input
// 					type="text"
// 					name="color"
// 					onChange={infoToBeSubmitted}
// 					placeholder={vehicle.color}
// 					// value={info.cellPhone}
// 				/>
// 			</div>

// 			<div>
// 				<label htmlFor="boughtPrice">Bought Price:</label>
// 				<input
// 					type="number"
// 					name="boughtPrice"
// 					onChange={infoToBeSubmitted}
// 					placeholder={vehicle.boughtPrice}
// 					// value={info.cellPhone}
// 				/>
// 			</div>
// 			<button type="submit">Add a new vehicle</button>
// 		</form>
// 	</div>
// )}
