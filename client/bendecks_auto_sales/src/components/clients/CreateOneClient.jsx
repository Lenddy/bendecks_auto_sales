import { useState } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { create_one_client } from "../../GraphQL/mutations/clientMutations";

const CreateOneClient = () => {
	const [info, setInfo] = useState({});
	const navigate = useNavigate();
	const [createOneClient] = useMutation(
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
	const infoToBeSubmitted = e => {
		setInfo({
			...info,
			[e.target.name]: e.target.value,
		});
	};

	// Function to handle form submission
	const submit = async e => {
		e.preventDefault(); // Prevent default form submission behavior

		await createOneClient({
			variables: {
				clientName: info?.clientName,
				clientLastName: info?.clientLastName,
				cellPhones: sections,
			},
		})
			.then(async res => {
				let id = res.data.createOneClient.id;
				await navigate(`/${id}`);
				// await console.log("here is the response", res.data.createOneClient);
			})
			.catch(error => {
				setValidations(true);
			});
	};

	const addSection = () => {
		setSections([...sections, { number: "" }]);
	};

	const handleInputChange = (e, index) => {
		const updatedSections = sections.map((section, secIndex) => {
			if (index === secIndex) {
				let value = e.target.value;
				if (!value) return { ...section, [e.target.name]: value };

				const phoneNumber = value.replace(/[^\d]/g, "");
				const phoneNumberLength = phoneNumber.length;

				if (phoneNumberLength <= 3) return { ...section, [e.target.name]: phoneNumber };
				if (phoneNumberLength <= 6) {
					return {
						...section,
						[e.target.name]: `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`,
					};
				}
				return {
					...section,
					[e.target.name]: `(${phoneNumber.slice(0, 3)})${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`,
				};
			}
			return section;
		});

		setSections(updatedSections);

		// Assuming you want to update the info object after formatting the phone number
		const updatedCellPhones = updatedSections.map(section => section.number);
		setInfo({ ...info, cellPhones: updatedCellPhones });
	};

	const deleteSection = index => {
		const filteredSections = sections.filter((_, secIndex) => secIndex !== index);
		setSections(filteredSections);
	};

	// Component rendering
	return (
		<div className="children-content">
			<h1 className="section">Nuevo Cliente</h1>
			<form onSubmit={submit} className="form-create">
				<div className="form-section">
					<div>
						<input
							type="text"
							name="clientName"
							onChange={e => {
								infoToBeSubmitted(e);
								setValidations(false);
							}}
							// value={info.clientName}
							placeholder="Nombre"
							className="form-input"
						/>
						{info?.clientName?.length > 0 && info?.clientName?.length < 2 ? <p className="input-validation">Nombre Debe De Tener Por Lo Menos 2 Caracteres</p> : validations ? <p className="input-validation">El Nombre Es Requerido</p> : null}
					</div>

					<div>
						<input
							name="clientLastName"
							onChange={e => {
								infoToBeSubmitted(e);
								setValidations(false);
							}}
							// value={info.clientLastName}
							placeholder="Apellido"
							className="form-input"
						/>
						{info?.clientLastName?.length > 0 && info?.clientLastName?.length < 2 ? <p className="input-validation">Apellido Debe De Tener Por Lo Menos 2 Caracteres</p> : validations ? <p className="input-validation">El Apellido Es Requerido</p> : null}
					</div>

					{sections.map((section, index) => (
						<div key={index} className="form-new-input-container">
							<div className="form-new-input">
								<input
									type="text"
									name="number"
									onChange={e => {
										handleInputChange(e, index);
										setValidations(false);
									}}
									placeholder="Teléfono"
									className="form-input"
									value={sections[index].number}
								/>

								{sections.length > 1 && (
									<div>
										<button type="button" onClick={() => deleteSection(index)} className="form-delete-input-section">
											<p>&#8722;</p>
										</button>
									</div>
								)}
							</div>

							{sections[index].number?.length > 0 && sections[index].number?.length < 13 ? (
								<div className="form-validation-container">
									<p className="input-validation">Numero Telefónico Debe Ser Valido</p>
								</div>
							) : validations ? (
								<div className="form-validation-container">
									<p className="input-validation">El Primer Numero Telefónico Es Requerido</p>
								</div>
							) : null}
						</div>
					))}

					<div className="form-new-section-btn-container">
						<button type="button" onClick={addSection} className="form-add-input-section">
							<p>&#43;</p>
						</button>
					</div>
				</div>

				<button type="submit" className={`form-submit-btn ${info?.clientName?.length >= 2 && info?.clientLastName?.length >= 2 && info?.cellPhones?.[0]?.length >= 13 ? "show" : "hide"}`}>
					Agregar Cliente
				</button>
			</form>
		</div>
	);
};

export default CreateOneClient;
