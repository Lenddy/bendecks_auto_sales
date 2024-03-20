import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";
import { create_one_client } from "../../GraphQL/mutations/clientMutations";
import { get_all_clients } from "../../GraphQL/queries/clientQueries";
import { gql } from "@apollo/client";
import io from "socket.io-client"; //importing socket.io-client

const CreateOneClient = ({ reload, setReload }) => {
	const [info, setInfo] = useState({
		// cellPhone: [{ number: "" }],
	});

	const navigate = useNavigate();

	// Apollo Client mutation hook for creating a single list item
	const [createOneClient, { error }] = useMutation(
		create_one_client
		// 	 {
		// 	update(cache, { data: { addNewItem } }) {
		// 		cache.modify({
		// 			fields: {
		// 				allItems(existingItems = []) {
		// 					const newItemRef = cache.writeFragment({
		// 						data: addNewItem,
		// 						fragment: gql`
		// 							fragment NewItem on Item {
		// 								id
		// 								clientName
		// 								clientLastName
		// 								cellPhone
		// 								createdAt
		// 								updatedAt
		// 							}
		// 						`,
		// 					});
		// 					let newInfo = [...existingItems, newItemRef];
		// 					console.log("new item", newItemRef);
		// 					console.log("the cache was updated", newInfo);
		// 					return newInfo;
		// 				},
		// 			},
		// 		});
		// 	},
		// }
	);
	const [sections, setSections] = useState([{ number: "" }]);

	const [validations, setValidations] = useState(false);

	// Function to handle input changes and update state accordingly
	const infoToBeSubmitted = (e) => {
		// if (e.target.name === "clientName") {
		// 	setValidations({ ...validations, [e.target.name]: null });
		// }
		setInfo({
			...info,
			[e.target.name]: e.target.value,
		});
	};

	// Function to handle form submission
	const submit = async (e) => {
		e.preventDefault(); // Prevent default form submission behavior

		await createOneClient({
			variables: {
				clientName: info?.clientName,
				clientLastName: info?.clientLastName,
				cellPhones: sections,
			},
			// this is re fetching the data
			refetchQueries: [{ query: get_all_clients }],
		})
			.then(async (res) => {
				let id = res.data.createOneClient.id;
				await navigate(`/${id}`);
				await console.log(
					"here is the response",
					res.data.createOneClient
				);
				// socket.emit("new_client_added", res.data.createOneClient);
				// setReload(!reload);
			})
			.catch((error) => {
				// console.log("fail");
				setValidations(true);

				// console.log(error);
			});
	};

	const addSection = () => {
		setSections([...sections, { number: "" }]);
	};

	// const handleInputChange = (e, index) => {
	// 	const updatedSections = sections.map((section, secIndex) => {
	// 		if (index === secIndex) {
	// 			let value = e.target.value;
	// 			if (!value) return { ...section, [e.target.name]: value };

	// 			const phoneNumber = value.replace(/[^\d]/g, "");
	// 			const phoneNumberLength = phoneNumber.length;

	// 			if (phoneNumberLength < 4)
	// 				return { ...section, [e.target.name]: phoneNumber };
	// 			if (phoneNumberLength < 7) {
	// 				return {
	// 					...section,
	// 					[e.target.name]: `(${phoneNumber.slice(
	// 						0,
	// 						3
	// 					)} ${phoneNumber.slice(3)}`,
	// 				};
	// 			}
	// 			return {
	// 				...section,
	// 				[e.target.name]: `(${phoneNumber.slice(
	// 					0,
	// 					3
	// 				)})${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`,
	// 			};
	// 		}
	// 		return section;
	// 	});

	// 	setSections(updatedSections);

	// 	// Assuming you want to update the info object after formatting the phone number
	// 	const updatedCellPhones = updatedSections.map(
	// 		(section) => section.number
	// 	);
	// 	setInfo({ ...info, cellPhones: updatedCellPhones });
	// };

	const handleInputChange = (e, index) => {
		const updatedSections = sections.map((section, secIndex) => {
			if (index === secIndex) {
				let value = e.target.value;
				if (!value) return { ...section, [e.target.name]: value };

				const phoneNumber = value.replace(/[^\d]/g, "");
				const phoneNumberLength = phoneNumber.length;

				if (phoneNumberLength <= 3)
					return { ...section, [e.target.name]: phoneNumber };
				if (phoneNumberLength <= 6) {
					return {
						...section,
						[e.target.name]: `(${phoneNumber.slice(
							0,
							3
						)}) ${phoneNumber.slice(3)}`,
					};
				}
				return {
					...section,
					[e.target.name]: `(${phoneNumber.slice(
						0,
						3
					)})${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`,
				};
			}
			return section;
		});

		setSections(updatedSections);

		// Assuming you want to update the info object after formatting the phone number
		const updatedCellPhones = updatedSections.map(
			(section) => section.number
		);
		setInfo({ ...info, cellPhones: updatedCellPhones });
	};

	const deleteSection = (index) => {
		const filteredSections = sections.filter(
			(_, secIndex) => secIndex !== index
		);
		setSections(filteredSections);
	};

	// TODO   show the submit button only when all fields are fill to the specific  requairments

	// TODO 	add the validations

	// Component rendering
	return (
		<div className="children_content">
			<h1>Agregar Cliente</h1>
			<form onSubmit={submit} className="createOneClientForm">
				<div className="creteOneFullSection">
					<div>
						<input
							type="text"
							name="clientName"
							onChange={(e) => {
								infoToBeSubmitted(e);
								setValidations(false);
							}}
							// value={info.clientName}
							placeholder="Nombre"
							className="createOneClientInput"
						/>
						{info?.clientName?.length > 0 &&
						info?.clientName?.length < 2 ? (
							<p className="input-validation">
								Nombre Debe De Tener Por Lo Menos 2 Caracteres
							</p>
						) : validations ? (
							<p className="input-validation">
								El Nombre Es Requerido
							</p>
						) : null}
					</div>

					<div>
						<input
							name="clientLastName"
							onChange={(e) => {
								infoToBeSubmitted(e);
								setValidations(false);
							}}
							// value={info.clientLastName}
							placeholder="Apellido"
							className="createOneClientInput"
						/>
						{info?.clientLastName?.length > 0 &&
						info?.clientLastName?.length < 2 ? (
							<p className="input-validation">
								Apellido Debe De Tener Por Lo Menos 2 Caracteres
							</p>
						) : validations ? (
							<p className="input-validation">
								El Apellido Es Requerido
							</p>
						) : null}
					</div>

					{sections.map((section, index) => (
						<div key={index} className="newSection">
							<input
								type="text"
								name="number"
								onChange={(e) => {
									handleInputChange(e, index);
									setValidations(false);
								}}
								placeholder="Teléfono"
								className="createOneClientInput space"
								value={sections[index].number}
							/>
							{/* {info?.cellPhones[index]?.number?.length > 0 &&
							info?.cellPhones[index]?.number?.length > 0 ? (
								<p>hello</p>
							) : null} */}

							{info?.cellPhones?.[index]?.number?.length > 0 &&
							info?.cellPhones?.[index]?.number?.length < 11 ? (
								<p className="input-validation">
									Numero Telefónico Debe Ser Valido
								</p>
							) : validations?.cellPhones ? (
								<p className="input-validation">
									El Primer Numero Telefónico Es Requerido
								</p>
							) : null}
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
					Agregar Cliente
				</button>
			</form>
		</div>
	);
};

export default CreateOneClient;
