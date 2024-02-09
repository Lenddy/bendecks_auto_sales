// Import necessary modules from Apollo Client and custom GraphQL queries
import { useNavigate, Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { get_one_client } from "../../GraphQL/queries/clientQueries";
import { useMutation, useQuery } from "@apollo/client";
import { update_One_client } from "../../GraphQL/mutations/clientMutations";
import { get_all_clients } from "../../GraphQL/queries/clientQueries";

function GetOneClient() {
	const { id } = useParams();

	const navigate = useNavigate();
	const navigateTO = (url) => {
		navigate(url);
	};
	// Fetch data using the useQuery hook by executing the getAllList query
	const { error, loading, data } = useQuery(get_one_client, {
		variables: { id },
	});

	// Set up state to manage the lists fetched from the query
	const [client, setClient] = useState();

	const [notFound, setNotFound] = useState(false);

	const [info, setInfo] = useState({
		test: "hello",
		// cellPhone: [],
	});

	useEffect(() => {
		if (!loading && data) {
			setClient(data.getOneClient);
		}
	}, [loading, data]);

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
			[e.target.getAttribute("name")]: e.target.innerText,
		});
	};

	const submit = (e) => {
		e.preventDefault();

		updateOneClient({
			variables: {
				id,
				clientName: info.clientName,
				clientLastName: info.clientLastName,
				cellPhone: info.cellPhone,
			},
			refetchQueries: [{ query: get_all_clients }],
		})
			.then((res) => {
				console.log(res.data);
				navigate(`/${id}`);
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
		}
		if (error) {
			console.log("there was an error", error); // Log an error message if an error occurs
			setNotFound(true);
		}
	}, [error, loading, data]); // Dependencies for the useEffect hook

	const [sections, setSections] = useState([{ cellPhone: "" }]);

	const addSection = () => {
		setSections([...sections, { cellPhone: "" }]);
	};

	const handleInputChange = (e, index) => {
		const updatedSections = sections.map((section, secIndex) => {
			if (index === secIndex) {
				return { ...section, [e.target.name]: e.target.value };
			}
			return section;
		});
		setSections(updatedSections);

		// Update the info.cellPhone with the cell phone numbers from all sections
		const updatedCellPhones = updatedSections.map(
			(section) => section.cellPhone
		);
		setInfo({ ...info, cellPhone: updatedCellPhones });
	};

	const deleteSection = (index) => {
		const filteredSections = sections.filter(
			(_, secIndex) => secIndex !== index
		);
		setSections(filteredSections);
	};

	// ! find a way to edit all the numbers on there section  what i am thinking is to use the splice method to  and also you should add the btns of adding a deleting and they will show when one of the inputs is on focus and they will disappear when they stop being on focus  and the edit should only affect the specific item on the array so thats why i thought on using the splice

	// ?  fixx send an object that takes the index number and the new info of that number to change in the back end

	// check to see if you need to add diferent field to the number array so that you can make the update easier

	// Render the retrieved lists
	return (
		<div className="getOne">
			{/* <Link to={"/dashboard"}> */}
			{/* <button onClick={() => navigateTO("/dashboard")}>dashboard</button> */}
			{/* </Link> */}

			{notFound ? (
				<h1 className="notFound">
					cliente con ID:<span>{id}</span> no se pudo encontrara
					asegúrese de que seal el id correcto
				</h1>
			) : (
				<div className="oneInfo">
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
									// onFocus={}
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
								>
									{client?.clientLastName}
								</h1>
							</div>
						</div>

						{client?.cellPhone?.length > 0 ? (
							client.cellPhone.map((phone, index) => (
								<div
									key={index}
									className="editablePhoneSection"
								>
									<h1
										contentEditable
										suppressContentEditableWarning
										name={`cellPhone-${index}`}
										onInput={infoToBeSubmitted}
										// onChange={infoToBeSubmitted}
										className="editableField"
									>
										{phone}
									</h1>
								</div>
							))
						) : (
							<div className="editablePhoneSection">
								<h1
									contentEditable
									suppressContentEditableWarning
									name="cellPhone-0"
									onInput={infoToBeSubmitted}
									// onChange={infoToBeSubmitted}
									className="editableField"
								>
									{client?.cellPhone[0]}
								</h1>
							</div>
						)}
						{/* {sections.map((section, index) => (
							<div key={index}>
								<h1
									contentEditable
									suppressContentEditableWarning
									onInput={(e) => handleInputChange(e, index)}
									className="editableField"
								>
									{section.cellPhone}
								</h1>
								<button onClick={() => deleteSection(index)}>
									Delete Section
								</button>
							</div>
						))}
						<button onClick={addSection}>Add New Section</button> */}
						<button type="submit" className="submit_btn">
							Update Client
						</button>
					</form>
				</div>
			)}
		</div>
	);
}

export default GetOneClient; // Export the GetAllList component
