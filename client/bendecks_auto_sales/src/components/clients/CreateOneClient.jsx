import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";
import { create_one_client } from "../../GraphQL/mutations/clientMutations";
import { get_all_clients } from "../../GraphQL/queries/clientQueries";
import { gql } from "@apollo/client";
import io from "socket.io-client"; //importing socket.io-client

const CreateOneClient = ({ reload, setReload }) => {
	const [info, setInfo] = useState({
		cellPhone: [""],
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
	const infoToBeSubmitted = (e, index) => {
		if (e.target.name === "cellPhone") {
			// Handle changes in cellPhone inputs
			const updatedCellPhones = info.cellPhone.map((phone, i) => {
				if (i === index) {
					return e.target.value;
				}
				return phone;
			});
			setInfo({ ...info, cellPhone: updatedCellPhones });
			console.log(setInfo);
		} else {
			// Handle changes in other inputs
			setInfo({ ...info, [e.target.name]: e.target.value });
			console.log(setInfo);
		}
	};

	const addSection = () => {
		setInfo({ ...info, cellPhone: [...info.cellPhone, ""] });
	};

	const deleteSection = (index) => {
		const filteredCellPhones = info.cellPhone.filter((_, i) => i !== index);
		setInfo({ ...info, cellPhone: filteredCellPhones });
	};

	// Function to handle form submission
	const submit = async (e) => {
		e.preventDefault(); // Prevent default form submission behavior

		await createOneClient({
			variables: {
				clientName: info.clientName,
				clientLastName: info.clientLastName,
				cellPhone: info.cellPhone,
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

	// Component rendering
	return (
		<div className="children_content">
			<form onSubmit={submit} className="createOneClientForm">
				<div className="creteOneFullSection">
					<div>
						<input
							type="text"
							name="clientName"
							onChange={infoToBeSubmitted}
							// value={info.clientName}
							placeholder="Nombre"
							className="createOneClientInput"
						/>
					</div>

					<div>
						<input
							name="clientLastName"
							onChange={infoToBeSubmitted}
							// value={info.clientLastName}
							placeholder="Apellido"
							className="createOneClientInput"
						/>
					</div>

					{info.cellPhone.map((phone, index) => (
						<div key={index} className="newSection">
							<input
								type="text"
								name="cellPhone"
								value={phone}
								onChange={(e) => infoToBeSubmitted(e, index)}
								placeholder="Teléfono"
								className="createOneClientInput space"
							/>
							{info.cellPhone.length > 1 && (
								<button
									type="button"
									onClick={() => deleteSection(index)}
									className="deleteSection"
								>
									<p>&#8722;</p>
								</button>
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
