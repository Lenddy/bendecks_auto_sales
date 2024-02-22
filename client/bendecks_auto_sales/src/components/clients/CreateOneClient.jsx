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

	// Function to handle input changes and update state accordingly
	const infoToBeSubmitted = (e) => {
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
				clientName: info.clientName,
				clientLastName: info.clientLastName,
				cellPhones: info.cellPhones,
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
				console.log(error);
			});
	};

	const [sections, setSections] = useState([{ number: "" }]);

	const handleInputChange = (e, index) => {
		const updatedSections = sections.map((section, secIndex) => {
			if (index === secIndex) {
				return { ...section, [e.target.name]: e.target.value };
			}
			return section;
		});

		setSections(updatedSections);
		setInfo({ ...info, cellPhones: updatedSections });

		// Update the info.cellPhone with the cell phone numbers from all sections
		// const updatedCellPhones = updatedSections.map(
		// 	(section) => section.number
		// );
		// setInfo({ ...info, cellPhones: updatedCellPhones });
	};

	const addSection = () => {
		setSections([...sections, { number: "" }]);
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
							name="clientName"
							onChange={(e) => infoToBeSubmitted(e)}
							// value={info.clientName}
							placeholder="Nombre"
							className="createOneClientInput"
						/>
					</div>

					<div>
						<input
							name="clientLastName"
							onChange={(e) => infoToBeSubmitted(e)}
							// value={info.clientLastName}
							placeholder="Apellido"
							className="createOneClientInput"
						/>
					</div>

					{sections.map((section, index) => (
						<div key={index} className="newSection">
							<input
								type="text"
								name="number"
								value={section.cellPhone}
								onChange={(e) => {
									handleInputChange(e, index);
									// infoToBeSubmitted(e);
								}}
								placeholder="Teléfono"
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
					Agregar Cliente
				</button>
			</form>
		</div>
	);
};

export default CreateOneClient;
