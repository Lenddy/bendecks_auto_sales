// Import necessary modules from Apollo Client and custom GraphQL queries
import { useNavigate, useParams } from "react-router-dom";
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
	const [clientDelete, setClientDelete] = useState(false);
	const [notFound, setNotFound] = useState(false);
	const [info, setInfo] = useState({});
	const [focus, setFocus] = useState(false);
	const [isFocused, setIsFocused] = useState(false);
	const [sections, setSections] = useState();
	const [numberUpdate, setNumberUpdate] = useState([]);
	const [confirmDelete, setConfirmDelete] = useState(Array(sections?.length).fill(false));

	// useEffect hook to handle changes in error, loading, and data states
	useEffect(() => {
		if (loading) {
			// console.log("loading"); // Log a message when data is loading
		}
		if (data) {
			console.log(data); // Log the fetched data
			setClient(data?.getOneClient); // Set the lists retrieved from the query to the state
			setSections(client?.cellPhones);
			// console.log("sections ----->", sections); // Log the fetched data
		}
		if (error) {
			// console.log("there was an error", error); // Log an error message if an error occurs
			setNotFound(true);
		}
		// console.log("sections info ", sections)
	}, [error, loading, data, client]); // Dependencies for the useEffect hook

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

	const deleteClient = () => {
		deleteOneClient({
			variables: {
				id, // Only pass the ID to the deletion mutation
			},
		})
			.then(() => {
				// Redirect after successful deletion
				navigate("/dashboard");
			})
			.catch(error => {
				console.log(error);
			});
	};

	const infoToBeSubmitted = e => {
		console.log(e);
		setInfo({
			...info,
			[e.target.getAttribute("name")]: e.target.innerText,
		});
	};

	const submit = e => {
		e.preventDefault();
		updateOneClient({
			variables: {
				id,
				clientName: info.clientName,
				clientLastName: info.clientLastName,
				cellPhones: numberUpdate,
			},
			refetchQueries: [{ query: get_all_clients }],
		})
			.then(res => {
				// console.log(res.data);
				setFocus(false);

				setNumberUpdate([]);
			})
			.catch(error => {
				console.log("there was an error", error);
			});
	};

	const addSection = () => {
		const newSection = {
			numberId: Date.now(), // Generate a unique timestamp as the numberId
			number: "", // Initial content is empty
			status: "add", // Status for adding
		};
		setNumberUpdate([...numberUpdate, newSection]);
		setSections(prevSections => [...prevSections, newSection]);
	};

	const deleteSection = index => {
		const filteredSections = sections.filter((_, secIndex) => secIndex !== index);
		setSections(filteredSections);

		const filterConfirmDelete = confirmDelete.filter((_, deletedIndex) => deletedIndex !== index);
		setConfirmDelete(filterConfirmDelete);

		// Check if section exists in numberUpdate
		let objectExists = false;
		const updatedNumberUpdate = numberUpdate.map(item => {
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
			updatedNumberUpdate.push(deletedSection); // Add to numberUpdate
		}
		setNumberUpdate(updatedNumberUpdate); // Update numberUpdate state
		setFocus(true);
	};

	const changeSectionVal = (e, index) => {
		const maxLength = 13;
		const updatedSections = sections.map((section, secIndex) => {
			if (index === secIndex) {
				let value = e.target.textContent;

				// Limit the length to 13 characters
				if (value.length > 13) {
					value = value.slice(0, maxLength);
				}

				if (!value) return { ...section, number: value };

				const phoneNumber = value.replace(/[^\d]/g, "");
				const formattedNumber = formatPhoneNumber(phoneNumber); // Format the phone number

				return { ...section, number: formattedNumber };
			}
			return section;
		});

		setSections(updatedSections);

		// Update the info object after formatting the phone number
		const updatedCellPhones = updatedSections.map(section => section.number);
		setInfo({ ...info, cellPhones: updatedCellPhones });

		// Update number update with the formatted number
		setNumberUpdate(prevNumberUpdate => {
			return prevNumberUpdate.map(item => {
				if (item.numberId === sections[index].numberId) {
					return {
						...item,
						number: updatedSections[index].number,
					};
				}
				return item;
			});
		});

		// Set focus to the end of the input
		e.target.focus();
		const range = document.createRange();
		const sel = window.getSelection();
		range.selectNodeContents(e.target);
		range.collapse(false);
		sel.removeAllRanges();
		sel.addRange(range);
	};

	// Function to format phone number
	const formatPhoneNumber = phoneNumber => {
		if (!phoneNumber) return "";

		const phoneNumberLength = phoneNumber.length;
		if (phoneNumberLength <= 3) {
			return phoneNumber;
		} else if (phoneNumberLength <= 6) {
			return `(${phoneNumber.slice(0, 3)})${phoneNumber.slice(3)}`;
		} else {
			return `(${phoneNumber.slice(0, 3)})${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
		}
	};

	const focusNewInput = () => {
		if (newSectionRef.current) {
			newSectionRef.current.focus();
		}
	};

	const toggleConfirmDelete = index => {
		setConfirmDelete(prevState => {
			const newState = [...prevState];
			newState[index] = !newState[index];
			return newState;
		});
	};

	const handleKeyDown = e => {
		const { keyCode } = e;
		const isNumericKey = keyCode >= 48 && keyCode <= 57; // Numeric keys (0-9)
		const isDeleteKey = keyCode === 8 || keyCode === 46; // Backspace or delete key codes
		const isMaxLength = e.target.textContent.length === 13;

		// Prevent input if not a numeric or delete key and already at maximum length
		if (!(isNumericKey || isDeleteKey) || (isMaxLength && isNumericKey)) {
			e.preventDefault();
		}
	};

	const handleMouseDown = event => {
		// Prevent default action to stop cursor movement when clicked
		if (isFocused) {
			event.preventDefault();
		}
	};

	return (
		<div className="children-content">
			<div>
				{notFound ? (
					<div>
						<h1>
							Cliente con ID:
							<span className="link-connection">{id}</span> no se pudo encontrara asegúrese de que seal el id correcto
						</h1>

						<button onClick={() => navigate("/")}>regresar</button>
					</div>
				) : (
					<div className="form-update-container">
						<h1 className="section">Cliente</h1>
						<h1 className="link-connection">{id}</h1>
						<form onSubmit={submit} className="form-update">
							<div className="form-section-union-container">
								<div className="form-section-union">
									<h1
										contentEditable
										suppressContentEditableWarning
										name="clientName"
										onInput={infoToBeSubmitted}
										className="form-editable-field"
										onFocus={() => setFocus(true)}
										// onBlur={() => setFocus(false)}
									>
										{client?.clientName}
									</h1>
								</div>

								<div className="form-section-union">
									<h1
										contentEditable
										suppressContentEditableWarning
										name="clientLastName"
										onInput={infoToBeSubmitted}
										className="form-editable-field"
										onFocus={() => setFocus(true)}
										// onBlur={() => setFocus(false)}
									>
										{client?.clientLastName}
									</h1>
								</div>
							</div>
							{sections?.length > 0 ? (
								sections.map((phone, index) => (
									<div key={phone?.numberId} className="form-editable-phone-section">
										{index === sections.length - 1 ? (
											<h1
												contentEditable
												suppressContentEditableWarning
												name={`cellPhone-${index}`}
												onInput={e => {
													changeSectionVal(e, index);
												}}
												onFocus={e => {
													setFocus(true);
													// handleFocus(e);
												}}
												onMouseDown={handleMouseDown}
												// onBlur={() => handleBlur()}
												className="form-editable-field"
												ref={index === sections.length - 1 ? newSectionRef : null}
												onKeyDown={handleKeyDown}
												key={index}>
												{phone?.number}
											</h1>
										) : (
											<h1
												contentEditable
												suppressContentEditableWarning
												className="form-editable-field"
												name={`cellPhone-${index}`}
												onInput={e => {
													changeSectionVal(e, index);
												}}
												onMouseDown={handleMouseDown}
												onFocus={() => setFocus(true)}
												onBlur={() => setFocus(false)}
												onKeyDown={handleKeyDown}>
												{phone?.number}
											</h1>
										)}

										{sections.length > 1 && (
											// form-confirm-deletion-container
											<div className="">
												{!confirmDelete[index] ? (
													<button type="button" className="form-delete-input-section space" onClick={() => toggleConfirmDelete(index)} key={index}>
														<p>&#8722;</p>
													</button>
												) : (
													<div className="form-confirm-deletion-container">
														<div className="">
															<button type="button" onClick={() => deleteSection(index)} className="form-delete-input-section" key={index}>
																<p> &#10003;</p>
															</button>
														</div>

														<div className="btnNewSection">
															<button type="button" onClick={() => toggleConfirmDelete(index)} className="form-delete-input-section" key={index}>
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
								<div className="form-editable-phone-section">
									<h1
										contentEditable
										suppressContentEditableWarning
										name="cellPhone-0"
										onInput={e => {
											changeSectionVal(e, 0);
										}}
										// onChange={infoToBeSubmitted}
										className="form-editable-field">
										{client?.cellPhones[0]?.number}
									</h1>
								</div>
							)}

							{/* it goes here */}
							<div className="form-new-section-btn-container">
								<button
									type="button"
									onClick={async () => {
										await addSection(), focusNewInput();
									}}
									className="form-add-input-section">
									<p>&#43;</p>
								</button>
							</div>

							<div className="form-submit-container">
								<button type="submit" className={`form-submit-btn ${focus ? "show" : "hide"}`}>
									Actualizar Cliente
								</button>

								{clientDelete === false ? (
									<button type="button" className={`form-submit-btn`} onClick={() => setClientDelete(true)}>
										Borrar Cliente
									</button>
								) : (
									<div className="confirm-delete-item">
										<div>
											<button type="button" onClick={() => deleteClient()} className="form-delete-input-section">
												<p> &#10003;</p>
											</button>
										</div>

										<div>
											<button type="button" onClick={() => setClientDelete(false)} className="form-delete-input-section">
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
		</div>
	);
}

export default GetOneClient; // Export the GetAllList component
