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
	const [yearSections, setYearSections] = useState();
	const [colorSections, setColorSections] = useState();

	const [vehicleModelUpdate, setVehicleModelUpdate] = useState([]);
	const [yearUpdate, setYearUpdate] = useState([]);
	const [colorUpdate, setColorUpdate] = useState([]);

	const [confirmDelete, setConfirmDelete] = useState(
		Array(sections?.length).fill(false)
	);
	const [confirmYearDelete, setConfirmYearDelete] = useState(
		Array(yearSections?.length).fill(false)
	);
	const [confirmColorDelete, setConfirmColorDelete] = useState(
		Array(yearSections?.length).fill(false)
	);

	const newSectionRef = useRef(null);
	const newYearSectionRef = useRef(null);
	const newColorSectionRef = useRef(null);

	const { error, loading, data } = useQuery(get_one_vehicle, {
		variables: { id },
	});

	const [updateOneVehicle] = useMutation(update_One_vehicle);
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
				vehicleModels: vehicleModelUpdate,
				years: yearUpdate,
				colors: colorUpdate,
				// boughtPrice: parseFloat(info.boughtPrice),
			},
			// this is re fetching the data
			refetchQueries: [{ query: get_all_vehicles }],
		})
			.then((res) => {
				console.log(res.data);
				setFocus(false);
				// navigate(`/vehicles/${id}`);
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
			setYearSections(vehicle?.years);
			setColorSections(vehicle?.colors);
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

	// ! for year

	const changeYearSectionVal = (e, index) => {
		let objectExists = false;

		const { __typename, yearId, ...sectionWithoutTypename } =
			yearSections[index];

		const itemUpdate = yearUpdate.map((item) => {
			if (item.status === "add" && item.yearId === yearId) {
				objectExists = true;
				return {
					yearId: item.yearId,
					year: e.target.textContent,
					status: "add",
				};
			}

			if (
				item.yearId === yearId &&
				item.yearId !== undefined &&
				item.status !== "add"
			) {
				objectExists = true;
				return {
					yearId: item.yearId,
					year: e.target.textContent,
					status: "update",
				};
			}

			if (item.status === "add" && item.yearId === yearId) {
				objectExists = true;
			}
			return item;
		});

		if (!objectExists) {
			itemUpdate.push({
				yearId,
				year: e.target.textContent,
				status: "update",
			});
		}

		setYearUpdate(itemUpdate);
	};

	const toggleConfirmYearDelete = (index) => {
		setConfirmYearDelete((prevState) => {
			const newState = [...prevState];
			newState[index] = !newState[index];
			return newState;
		});
	};

	const deleteYearSection = (index) => {
		const filteredSections = yearSections.filter(
			(_, secIndex) => secIndex !== index
		);
		setYearSections(filteredSections);

		const filterConfirmDelete = confirmYearDelete.filter(
			(_, deletedIndex) => deletedIndex !== index
		);
		setConfirmYearDelete(filterConfirmDelete);

		// Check if section exists in numberUpdate
		let objectExists = false;
		const itemUpdate = yearUpdate.map((item) => {
			if (item.id === index) {
				objectExists = true;
				return { ...item, status: "delete" }; // Update status to "delete"
			}
			return item;
		});

		// If section doesn't exist, add it to numberUpdate
		if (!objectExists) {
			const { __typename, ...sectionWithoutTypename } =
				yearSections[index]; // Destructure __typename and get the rest of the properties
			const deletedSection = {
				...sectionWithoutTypename,
				status: "delete",
			}; // Create a new object without __typename and with status field
			itemUpdate.push(deletedSection); // Add to numberUpdate
		}
		setYearUpdate(itemUpdate); // Update numberUpdate state
		setFocus(true);
	};

	const addYearSection = () => {
		const newSection = {
			yearId: Date.now(), // Generate a unique timestamp as the numberId
			year: "", // Initial content is empty
			status: "add", // Status for adding
		};
		setYearUpdate([...yearUpdate, newSection]);
		setYearSections((prevSections) => [...prevSections, newSection]);
	};

	const focusYearNewInput = () => {
		if (newYearSectionRef.current) {
			newYearSectionRef.current.focus();
		}
	};

	// !for color

	const changeColorSectionVal = (e, index) => {
		let objectExists = false;

		const { __typename, colorId, ...sectionWithoutTypename } =
			colorSections[index];

		const itemUpdate = colorUpdate.map((item) => {
			if (item.status === "add" && item.colorId === colorId) {
				objectExists = true;
				return {
					colorId: item.colorId,
					color: e.target.textContent,
					status: "add",
				};
			}

			if (
				item.colorId === colorId &&
				item.colorId !== undefined &&
				item.status !== "add"
			) {
				objectExists = true;
				return {
					colorId: item.colorId,
					color: e.target.textContent,
					status: "update",
				};
			}

			if (item.status === "add" && item.colorId === colorId) {
				objectExists = true;
			}
			return item;
		});

		if (!objectExists) {
			itemUpdate.push({
				colorId,
				color: e.target.textContent,
				status: "update",
			});
		}

		setColorUpdate(itemUpdate);
	};

	const toggleConfirmColorDelete = (index) => {
		setConfirmColorDelete((prevState) => {
			const newState = [...prevState];
			newState[index] = !newState[index];
			return newState;
		});
	};

	const deleteColorSection = (index) => {
		const filteredSections = colorSections.filter(
			(_, secIndex) => secIndex !== index
		);
		setColorSections(filteredSections);

		const filterConfirmDelete = confirmColorDelete.filter(
			(_, deletedIndex) => deletedIndex !== index
		);
		setConfirmColorDelete(filterConfirmDelete);

		// Check if section exists in numberUpdate
		let objectExists = false;
		const itemUpdate = colorUpdate.map((item) => {
			if (item.id === index) {
				objectExists = true;
				return { ...item, status: "delete" }; // Update status to "delete"
			}
			return item;
		});

		// If section doesn't exist, add it to numberUpdate
		if (!objectExists) {
			const { __typename, ...sectionWithoutTypename } =
				colorSections[index]; // Destructure __typename and get the rest of the properties
			const deletedSection = {
				...sectionWithoutTypename,
				status: "delete",
			}; // Create a new object without __typename and with status field
			itemUpdate.push(deletedSection); // Add to numberUpdate
		}
		setColorUpdate(itemUpdate); // Update numberUpdate state
		setFocus(true);
	};

	const addColorSection = () => {
		const newSection = {
			colorId: Date.now(), // Generate a unique timestamp as the numberId
			color: "", // Initial content is empty
			status: "add", // Status for adding
		};
		setColorUpdate([...colorUpdate, newSection]);
		setColorSections((prevSections) => [...prevSections, newSection]);
	};

	const focusColorNewInput = () => {
		if (newColorSectionRef.current) {
			newColorSectionRef.current.focus();
		}
	};

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
						{/* models */}
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
											name={`model-${index}`}
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
											name={`model-${index}`}
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

						{/* years */}
						<h1>Years</h1>
						{yearSections?.length > 0 ? (
							yearSections.map((year, index) => (
								<div
									key={year?.yearId}
									className="editablePhoneSection"
								>
									{index === yearSections.length - 1 ? (
										<h1
											contentEditable
											suppressContentEditableWarning
											name={`year-${index}`}
											onInput={(e) => {
												changeYearSectionVal(e, index);
											}}
											onFocus={() => setFocus(true)}
											// onBlur={() => setFocus(false)}
											className="editableField"
											ref={
												index ===
												yearSections.length - 1
													? newYearSectionRef
													: null
											}
											key={index}
										>
											{year?.year}
										</h1>
									) : (
										<h1
											contentEditable
											suppressContentEditableWarning
											className="editableField"
											name={`year-${index}`}
											onInput={(e) => {
												changeYearSectionVal(e, index);
											}}
											onFocus={() => setFocus(true)}
											// onBlur={() => setFocus(false)}
										>
											{year?.year}
										</h1>
									)}

									{yearSections.length > 1 && (
										<div>
											{!confirmYearDelete[index] ? (
												<button
													type="button"
													className="deleteSection -update"
													onClick={() =>
														toggleConfirmYearDelete(
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
																deleteYearSection(
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
																toggleConfirmYearDelete(
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
										changeYearSectionVal(e, 0);
									}}
									// onChange={infoToBeSubmitted}
									className="editableField"
								>
									{vehicle?.years[0]?.year}
								</h1>
							</div>
						)}

						<div className="btnNewSection">
							<button
								type="button"
								onClick={async () => {
									await addYearSection(), focusYearNewInput();
								}}
								className="addSection"
							>
								<p>&#43;</p>
							</button>
						</div>
						<h1>Colores</h1>

						{colorSections?.length > 0 ? (
							colorSections.map((color, index) => (
								<div
									key={color?.colorId}
									className="editablePhoneSection"
								>
									{index === colorSections.length - 1 ? (
										<h1
											contentEditable
											suppressContentEditableWarning
											name={`color-${index}`}
											onInput={(e) => {
												changeColorSectionVal(e, index);
											}}
											onFocus={() => setFocus(true)}
											// onBlur={() => setFocus(false)}
											className="editableField"
											ref={
												index ===
												colorSections.length - 1
													? newColorSectionRef
													: null
											}
											key={index}
										>
											{color?.color}
										</h1>
									) : (
										<h1
											contentEditable
											suppressContentEditableWarning
											className="editableField"
											name={`color-${index}`}
											onInput={(e) => {
												changeColorSectionVal(e, index);
											}}
											onFocus={() => setFocus(true)}
											// onBlur={() => setFocus(false)}
										>
											{color?.color}
										</h1>
									)}

									{colorSections.length > 1 && (
										<div>
											{!confirmColorDelete[index] ? (
												<button
													type="button"
													className="deleteSection -update"
													onClick={() =>
														toggleConfirmColorDelete(
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
																deleteColorSection(
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
																toggleConfirmColorDelete(
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
										changeColorSectionVal(e, 0);
									}}
									// onChange={infoToBeSubmitted}
									className="editableField"
								>
									{vehicle?.years[0]?.year}
								</h1>
							</div>
						)}

						<div className="btnNewSection">
							<button
								type="button"
								onClick={async () => {
									await addColorSection(),
										focusColorNewInput();
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
