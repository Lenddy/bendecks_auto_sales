import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { delete_one_client } from "../../GraphQL/mutations/clientMutations";
import { get_one_client } from "../../GraphQL/queries/clientQueries";
import { useNavigate, useParams, Link } from "react-router-dom";
import { get_all_clients } from "../../GraphQL/queries/clientQueries";
const DeleteOneClient = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [client, setClient] = useState();

	const { error, loading, data } = useQuery(get_one_client, {
		variables: { id },
	});

	useEffect(() => {
		if (loading) {
			console.log("loading");
		}
		if (data) {
			setClient(data.getOneClient);
		}
		if (error) {
			console.log("there was an error", error);
		}
	}, [error, loading, data]);

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
			refetchQueries: [{ query: get_all_clients }],
		})
			.then(() => {
				// Redirect after successful deletion
				navigate("/dashboard");
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<div>
			<h1>hello</h1>
			<Link to={"/dashboard"}>
				<button>dashboard</button>
			</Link>
			<div>
				<button onClick={deleteClient}>Delete</button>
			</div>
		</div>
	);
};

export default DeleteOneClient;
