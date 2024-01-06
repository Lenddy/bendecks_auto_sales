// import { useState, useEffect } from "react";
// import { update_One_List } from "../GraphQL/Mutations";
// import { useMutation, useQuery } from "@apollo/client";
// import { useNavigate, useParams } from "react-router-dom";
// import { get_one_list } from "../GraphQL/Queries";

// const UpdateOneList = () => {
// 	const { id } = useParams();
// 	const navigate = useNavigate();

// 	// Fetching data for a single list based on the provided ID
// 	const { error, loading, data } = useQuery(get_one_list, {
// 		variables: { id },
// 	});

// 	const [info, setInfo] = useState({
// 		title: "",
// 		description: "",
// 		// isDone
// 	});

// 	const [list, setList] = useState(null);
// 	const [checked, setReload] = useState(false);

// 	// Update the 'list' state when the data fetching is completed
// 	useEffect(() => {
// 		if (!loading && data) {
// 			setList(data.getOneList);
// 		}
// 	}, [loading, data]);

// 	const [updateOneList] = useMutation(update_One_List);

// 	// Function to handle input changes and update 'info' state accordingly
// 	const infoToBeSubmitted = (e) => {
// 		const value =
// 			e.target.type === "checkbox" ? e.target.checked : e.target.value;

// 		setInfo({
// 			...info,
// 			[e.target.name]: value,
// 		});
// 	};

// 	// Function to handle form submission and update the list
// 	const submit = (e) => {
// 		e.preventDefault();

// 		updateOneList({
// 			variables: {
// 				id,
// 				title: info.title,
// 				description: info.description,
// 				isDone: info.isDone,
// 			},
// 		})
// 			.then(() => {
// 				setInfo({
// 					title: "",
// 					description: "",
// 					isDone: false,
// 				});
// 				navigate(`/${id}`);
// 			})
// 			.catch((error) => {
// 				console.log(error);
// 			});
// 	};
// 	const { isItDone, setIsItDone } = useState(list?.isDone);

// 	return (
// 		<div>
// 			{/* Conditional rendering based on the loading state */}
// 			{loading ? (
// 				<p>Loading...</p>
// 			) : (
// 				// Check if 'list' data is available before rendering the form
// 				list && (
// 					<form onSubmit={submit}>
// 						<div>
// 							<label htmlFor="title">Title:</label>
// 							<input
// 								type="text"
// 								name="title"
// 								onChange={infoToBeSubmitted}
// 								value={info.title}
// 								// || list.title
// 								placeholder={list.title}
// 							/>
// 						</div>
// 						<div>
// 							<label htmlFor="description">Description:</label>
// 							<textarea
// 								name="description"
// 								onChange={infoToBeSubmitted}
// 								value={info.description}
// 								// || list.description
// 								placeholder={list.description}
// 								cols="30"
// 								rows="10"
// 							></textarea>
// 						</div>
// 						<div>
// 							<label htmlFor="isDone">Mark as Done:</label>
// 							<input
// 								type="checkbox"
// 								name="isDone"
// 								onChange={infoToBeSubmitted}
// 								onClick={() => setIsItDone(!isItDone)}
// 								checked={isItDone} //
// 								// placeholder={list.isDone}
// 							/>
// 							<label>Yes</label>
// 						</div>
// 						<button type="submit">Update List</button>
// 					</form>
// 				)
// 			)}
// 		</div>
// 	);
// };

// export default UpdateOneList;
import { useState, useEffect } from "react";
import { update_One_List } from "../../GraphQL/mutations/Mutations";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { get_one_list } from "../../GraphQL/queries/clientQueries";

const UpdateOneList = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const { error, loading, data } = useQuery(get_one_list, {
		variables: { id },
	});

	const [info, setInfo] = useState({
		title: "",
		description: "",
		isDone: false, // Added isDone with a default value of false
	});

	const [list, setList] = useState(null);

	useEffect(() => {
		if (!loading && data) {
			setList(data.getOneList);
		}
	}, [loading, data]);

	const [updateOneList] = useMutation(update_One_List);

	const infoToBeSubmitted = (e) => {
		const value =
			e.target.type === "checkbox" ? e.target.checked : e.target.value;

		setInfo({
			...info,
			[e.target.name]: value,
		});
	};

	const submit = (e) => {
		e.preventDefault();

		updateOneList({
			variables: {
				id,
				title: info.title,
				description: info.description,
				isDone: info.isDone,
			},
		})
			.then(() => {
				setInfo({
					title: "",
					description: "",
					isDone: false,
				});
				navigate(`/${id}`);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<div>
			{loading ? (
				<p>Loading...</p>
			) : (
				list && (
					<form onSubmit={submit}>
						<div>
							<label htmlFor="title">Title:</label>
							<input
								type="text"
								name="title"
								onChange={infoToBeSubmitted}
								value={info.title}
								placeholder={list.title}
							/>
						</div>
						<div>
							<label htmlFor="description">Description:</label>
							<textarea
								name="description"
								onChange={infoToBeSubmitted}
								value={info.description}
								placeholder={list.description}
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
						<button type="submit">Update List</button>
					</form>
				)
			)}
		</div>
	);
};

export default UpdateOneList;
