import { useState, useEffect } from "react";
import { useMutation } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { create_one_client } from "../../GraphQL/mutations/clientMutations";
import io from "socket.io-client"; //importing socket.io-client

const CreateOneClient = ({ reload, setReload }) => {
	// const [socket] = useState(() => io(":8080")); //connect to the server

	// socket.on("new_connection", (data) => {
	// 	console.log(data);
	// });

	// State to manage form data
	// Dependencies for the useEffect hook
	const [info, setInfo] = useState({
		// title: "",
		// description: "",
		// isDone: false,
		cellPhone: [],
	});

	const navigate = useNavigate();

	// Apollo Client mutation hook for creating a single list item
	const [createOneClient, { error }] = useMutation(create_one_client);

	// Function to handle input changes and update state accordingly
	const infoToBeSubmitted = (e) => {
		// const value =
		// 	e.target.type === "checkbox" ? e.target.checked : e.target.value;

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
				cellPhone: info.cellPhone,
			},
		})
			.then(async (res) => {
				// Reset the form fields after successful submission

				// setInfo({
				// 	// title: "",
				// 	// description: "",
				// 	// isDone: false,
				// 	cellPhone: [],
				// });
				await console.log(
					"here is the response",
					res.data.createOneClient
				);
				await navigate("/dashboard");
				// socket.emit("new_client_added", res.data.createOneClient);
				// setReload(!reload);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	// Component rendering
	return (
		<div>
			<form onSubmit={submit}>
				<div>
					<label htmlFor="clientName">Name:</label>
					<input
						type="text"
						name="clientName"
						onChange={infoToBeSubmitted}
						// value={info.clientName}
					/>
				</div>
				<div>
					<label htmlFor="clientLastName">Last Name:</label>
					<input
						name="clientLastName"
						onChange={infoToBeSubmitted}
						// value={info.clientLastName}
					></input>
				</div>
				<div>
					<label htmlFor="cellPhone">cell phone:</label>
					<input
						type="text"
						name="cellPhone"
						onChange={infoToBeSubmitted}
						// value={info.cellPhone}
					/>
				</div>
				<button type="submit">Add a new client</button>
			</form>
		</div>
	);
};

export default CreateOneClient;
