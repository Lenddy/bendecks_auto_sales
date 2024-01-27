// Import necessary modules from Apollo Client and custom GraphQL queries
import { useQuery } from "@apollo/client"; // Import useQuery hook to execute GraphQL queries
import { useNavigate, Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { get_one_client } from "../../GraphQL/queries/clientQueries";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { get_one_client } from "../../GraphQL/queries/clientQueries";
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
		cellPhone: [],
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
			[e.target.name]: e.target.value,
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
					<h1 className="title"> {client?.id}</h1>
					<h1 className="title">
						{client?.clientName} {client?.clientLastName}
					</h1>
					<p>
						Phone NUmber:{" "}
						{client?.cellPhone.map((n, idx) => {
							return (
								<span key={idx}>
									<span>{n}</span> ,
								</span>
							);
						})}
					</p>
					<Link to={`/${client?.id}`}>
						<button>view</button>
					</Link>
					<Link to={`/update/${client?.id}`}>
						<button>update</button>
					</Link>
					<Link to={`/delete/${client?.id}`}>
						<button>delete</button>
					</Link>


					<form onSubmit={submit}>
						<div>
							<label htmlFor="clientName">Client Name:</label>
							<input
								type="text"
								name="clientName"
								onChange={infoToBeSubmitted}
								// value={info.title}
								placeholder={client.clientName}
							/>
						</div>
						<div>
							<label htmlFor="clientLastName">
								Client Last Name:
							</label>
							<input
								name="clientLastName"
								onChange={infoToBeSubmitted}
								placeholder={client.clientLastName}
							/>
						</div>
						<div>
							<label htmlFor="cellPhone">Cell Phone:</label>
							<input
								type="text"
								name="cellPhone"
								onChange={infoToBeSubmitted}
								placeholder={client.cellPhone}
							/>
						</div>
						<button type="submit">Update client</button>
					</form>
				</div>



			)}
		</div>
	);
}

export default GetOneClient; // Export the GetAllList component

// {list.map((l, idx) => {})}


const UpdateOneClient = () => {
	

	return (
		<div>
			{loading ? (
				<p>Loading...</p>
			) : (
				client && (
					
				)
			)}
		</div>
	);
};

export default UpdateOneClient;
