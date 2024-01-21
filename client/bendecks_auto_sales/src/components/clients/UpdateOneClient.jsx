import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { get_one_client } from "../../GraphQL/queries/clientQueries";
import { update_One_client } from "../../GraphQL/mutations/clientMutations";
import { get_all_clients } from "../../GraphQL/queries/clientQueries";

const UpdateOneClient = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const { error, loading, data } = useQuery(get_one_client, {
		variables: { id },
	});

	const [info, setInfo] = useState({
		cellPhone: [],
	});

	const [client, setClient] = useState();

	useEffect(() => {
		if (!loading && data) {
			setClient(data.getOneClient);
		}
	}, [loading, data]);

	const [updateOneClient] = useMutation(update_One_client, {
		update(cache, { data: { updateItem } }) {
			cache.writeFragment({
				id: cache.identify(updateItem),
				fragment: gql`
					fragment UpdatedItem on Item {
						id
						... // updated fields
					}
				`,
				data: updateItem,
			});
		},
	});

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

	return (
		<div>
			{loading ? (
				<p>Loading...</p>
			) : (
				client && (
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
				)
			)}
		</div>
	);
};

export default UpdateOneClient;
