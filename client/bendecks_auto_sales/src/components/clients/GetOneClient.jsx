// Import necessary modules from Apollo Client and custom GraphQL queries
import { useNavigate, Link, useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { get_one_client } from "../../GraphQL/queries/clientQueries";
import { useMutation, useQuery } from "@apollo/client";
import { update_One_client } from "../../GraphQL/mutations/clientMutations";
import { delete_one_client } from "../../GraphQL/mutations/clientMutations";
import { get_all_clients } from "../../GraphQL/queries/clientQueries";

function GetOneClient() {
	const { id } = useParams();
	const newSectionRef = useRef(null);

	const navigate = useNavigate();

	// Fetch data using the useQuery hook by executing the getAllList query
	const { error, loading, data } = useQuery(get_one_client, {
		variables: { id },
	});

	// Set up state to manage the lists fetched from the query
	const [client, setClient] = useState();

	const [notFound, setNotFound] = useState(false);

	const [info, setInfo] = useState({});
	const [focus, setFocus] = useState(false);

	const [sections, setSections] = useState();
	const [numberUpdate, setNumberUpdate] = useState([]);
	const [confirmDelete, setConfirmDelete] = useState(
		Array(sections?.length).fill(false)
	);

	const [updateOneClient] = useMutation(
		update_One_client
		// 	{
		// 	update(cache, { data: { updateItem } }) {
		// 		cache.writeFragment({
		// 			id: cache.identify(updateItem),
		// 			fragment: gql`
		// 				fragment UpdatedItem on Item {
		// 					id
		// 					... // updated fields
		// 				}
		// 			`,
		// 			data: updateItem,
		// 		});
		// 	},
		// }
	);

	const infoToBeSubmitted = (e) => {
		setInfo({
			...info,
			[e.target.name]: e.target.innerText,
		});
	};

	const submit = (e) => {
		e.preventDefault();
		// let sectionInfo = [];
		// if (Object.keys(numberUpdate).length > 0) {
		// 	console.log("there are keys");
		// 	for (let [key, value] of Object.entries(numberUpdate)) {
		// 		console.table(key, value);
		// 		sectionInfo.push({ id: key, number: value });
		// 	}
		// }
		// console.log("section info", sectionInfo);
		updateOneClient({
			variables: {
				id,
				clientName: info.clientName,
				clientLastName: info.clientLastName,
				cellPhone: numberUpdate,
			},
			refetchQueries: [{ query: get_all_clients }],
		})
			.then((res) => {
				console.log(res.data);
				// navigate(`/${id}`);
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
			setClient(data.getOneClient); // Set the lists retrieved from the query to the state
			setSections(client?.cellPhone);
		}
		if (error) {
			console.log("there was an error", error); // Log an error message if an error occurs
			setNotFound(true);
		}
	}, [error, loading, data, client]); // Dependencies for the useEffect hook

	const addSection = () => {
		setSections((prevSections) => [...prevSections, ""]);
	};

	// ! figure out a way to delete one or multiple number from he data base
	const deleteSection = (index) => {
		const filteredSections = sections.filter(
			(_, secIndex) => secIndex !== index
		);
		setSections(filteredSections);

		const filterConfirmDelete = confirmDelete.filter(
			(_, deletedIndex) => deletedIndex !== index
		);
		setConfirmDelete(filterConfirmDelete);
		let objectExists = false;

		const updatedNumberUpdate = numberUpdate.map((item) => {
			if (item.id === index) {
				objectExists = true;
				return {
					...item,
					number: sections[index],
					status: "delete",
				};
			}
			return item;
		});
		if (!objectExists) {
			updatedNumberUpdate.push({
				id: index,
				number: sections[index],
				status: "delete",
			});
		}

		setNumberUpdate(updatedNumberUpdate);
	};

	const changeSectionVal = (e, index) => {
		let objectExists = false;

		const updatedNumberUpdate = numberUpdate.map((item) => {
			if (item.id === index) {
				objectExists = true;
				return {
					...item,
					number: e.target.textContent,
					status: "update",
				};
			}
			return item;
		});

		if (!objectExists) {
			updatedNumberUpdate.push({
				id: index,
				number: e.target.textContent,
				status: "update",
			});
		}

		setNumberUpdate(updatedNumberUpdate);
	};

	const focusNewInput = () => {
		if (newSectionRef.current) {
			newSectionRef.current.focus();
		}
	};

	const toggleConfirmDelete = (index) => {
		setConfirmDelete((prevState) => {
			const newState = [...prevState];
			newState[index] = !newState[index];
			return newState;
		});
	};

	const [deleteOneClient] = useMutation(
		delete_one_client
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

	const [clientDelete, setClientDelete] = useState(false);

	const deleteClient = () => {
		deleteOneClient({
			variables: {
				id, // Only pass the ID to the deletion mutation
			},
			refetchQueries: [{ query: get_all_clients }],
		})
			.then(() => {
				// Redirect after successful deletion
				navigate("/dashboard");
			})
			.catch((error) => {
				console.log(error);
			});
	};

	// now figure out how to delete the last deleted items from the database  maybe add a new field that says delete and update so that in the back end you can make the change to delete and or updated

	return (
		<div className="getOne">
			{notFound ? (
				<div>
					<h1 className="notFound">
						cliente con ID:<span>{id}</span> no se pudo encontrara
						asegúrese de que seal el id correcto
					</h1>

					<button>regresar</button>
				</div>
			) : (
				<div className="oneInfo">
					<div>
						<button className={`submit_btn`}>Borrar Cliente</button>
					</div>
					<h1 className="notFound">{id}</h1>
					<form onSubmit={submit} className="getOneForm">
						<div className="section_union">
							<div>
								<h1
									contentEditable
									suppressContentEditableWarning
									name="clientName"
									onInput={infoToBeSubmitted}
									className="editableField "
									onFocus={() => setFocus(true)}
									onBlur={() => setFocus(false)}
								>
									{client?.clientName}
								</h1>
							</div>

							<div>
								<h1
									contentEditable
									suppressContentEditableWarning
									name="clientLastName"
									onInput={infoToBeSubmitted}
									className="editableField"
									onFocus={() => setFocus(true)}
									onBlur={() => setFocus(false)}
								>
									{client?.clientLastName}
								</h1>
							</div>
						</div>
						{/* so get the las index + 1 to make the new section be */}
						{/* .cellPhone? */}
						{sections?.length > 0 ? (
							sections.map((phone, index) => (
								<div
									key={index}
									className="editablePhoneSection"
								>
									{index === sections.length - 1 ? (
										<h1
											contentEditable
											suppressContentEditableWarning
											name={`cellPhone-${index}`}
											onInput={(e) => {
												changeSectionVal(e, index);
											}}
											onFocus={() => setFocus(true)}
											onBlur={() => setFocus(false)}
											className="editableField"
											ref={
												index === sections.length - 1
													? newSectionRef
													: null
											}
										>
											{/*   */}
											{phone}
										</h1>
									) : (
										<h1
											contentEditable
											suppressContentEditableWarning
											className="editableField"
											name={`cellPhone-${index}`}
											onInput={(e) => {
												changeSectionVal(e, index);
											}}
											onFocus={() => setFocus(true)}
											onBlur={() => setFocus(false)}
										>
											{phone}
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
									name="cellPhone-0"
									onInput={(e) => {
										changeSectionVal(e, 0);
									}}
									// onChange={infoToBeSubmitted}
									className="editableField"
								>
									{client?.cellPhone[0]}
								</h1>
							</div>
						)}

						<div className="btnNewSection">
							<button
								type="button"
								onClick={async () => {
									await addSection(), focusNewInput();
									// setTimeout(
									// 	() =>
									// 		,
									// 	50
									// );
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
								//
								//
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
}

export default GetOneClient; // Export the GetAllList component

// // handles the Input Changes from the inputs that have multiple sections
// const handleInputChange = (e, index) => {
// 	const updatedSections = sections.map((section, secIndex) => {
// 		if (index === secIndex) {
// 			return { ...section, [e.target.name]: e.target.value };
// 		}
// 		return section;
// 	});
// 	setSections(updatedSections);

// 	// Update the info.cellPhone with the cell phone numbers from all sections
// 	const updatedCellPhones = updatedSections.map(
// 		(section) => section.cellPhone
// 	);
// 	setInfo({ ...info, cellPhone: updatedCellPhones });
// };
