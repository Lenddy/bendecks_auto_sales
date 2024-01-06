import { useState, useEffect } from "react";
import { create_One_List } from "../../GraphQL/mutations/Mutations";
import { useMutation } from "@apollo/client";

const DeleteOneList = () => {
	// State to manage form data
	// Dependencies for the useEffect hook
	const [info, setInfo] = useState({
		title: "",
		description: "",
		isDone: false,
	});

	const [reload, setReload] = useState(false);

	useEffect(() => {}, [reload]);

	// Apollo Client mutation hook for creating a single list item
	const [createOneList, { error }] = useMutation(create_One_List);

	// Function to handle input changes and update state accordingly
	const infoToBeSubmitted = (e) => {
		const value =
			e.target.type === "checkbox" ? e.target.checked : e.target.value;

		setInfo({
			...info,
			[e.target.name]: value,
		});
	};

	// Function to handle form submission
	const submit = (e) => {
		e.preventDefault(); // Prevent default form submission behavior

		createOneList({
			variables: {
				title: info.title,
				description: info.description,
				isDone: info.isDone,
			},
		})
			.then(() => {
				// Reset the form fields after successful submission
				setInfo({
					title: "",
					description: "",
					isDone: false,
				});
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
					<label htmlFor="title">Title:</label>
					<input
						type="text"
						name="title"
						onChange={infoToBeSubmitted}
						value={info.title}
					/>
				</div>
				<div>
					<label htmlFor="description">Description:</label>
					<textarea
						name="description"
						onChange={infoToBeSubmitted}
						value={info.description}
						cols="30"
						rows="10"
					></textarea>
				</div>
				<div>
					<label htmlFor="isDone">Mark as Done:</label>
					<input
						type="checkbox"
						name="isDone"
						onChange={infoToBeSubmitted}
						checked={info.isDone}
					/>
					<label>Yes</label>
				</div>
				<button type="submit" onClick={() => setReload(!reload)}>
					Add a new list
				</button>
			</form>
		</div>
	);
};

export default DeleteOneList;
