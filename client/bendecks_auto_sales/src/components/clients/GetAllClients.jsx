// Import necessary modules from Apollo Client and custom GraphQL queries
import { useQuery, useSubscription } from "@apollo/client"; // Import useQuery hook to execute GraphQL queries
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { get_all_clients } from "../../GraphQL/queries/clientQueries";
import { CLIENT_CHANGE_SUBSCRIPTION } from "../../GraphQL/subscriptions/subscriptions";

function GetAllClients() {
	// Fetch data using the useQuery hook by executing the getAllClients query
	const { error, loading, data, refetch } = useQuery(get_all_clients);
	const [clients, setClients] = useState([]);
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const [search, setSearch] = useState("");
	// useSubscription(CLIENT_CHANGE_SUBSCRIPTION, {
	// 	onData: ({ subscriptionData }) => {
	// 		const newClient = subscriptionData.data.newClient;
	// 		client.cache.modify({
	// 			fields: {
	// 				getAllClients(existingClients = []) {
	// 					const newClientRef = client.cache.writeFragment({
	// 						data: newClient,
	// 						fragment: gql`
	// 							fragment NewClient on Client {
	// 								id
	// 								clientName
	// 							}
	// 						`,
	// 					});

	// 					return [newClientRef, ...existingClients];
	// 				},
	// 			},
	// 		});
	// 	},
	// });

	useEffect(() => {
		const handleResize = () => {
			setWindowWidth(window.innerWidth);
		};
		window.addEventListener("resize", handleResize);
		// Cleanup
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []); // Empty dependency array ensures that this effect runs only once on mount

	useEffect(() => {
		if (loading) {
			// console.log("loading");
		}
		if (data) {
			// console.log(data);
			setClients(data.getAllClients);
		}
		if (error) {
			// console.log("there was an error", error);
		}
		const fetchData = async () => {
			await refetch();
		};
		fetchData();
	}, [error, loading, data, refetch]);

	// Subscription for client changes
	useSubscription(CLIENT_CHANGE_SUBSCRIPTION, {
		onError: err => console.log("this is the error from subscription", err),
		onData: infoChange => {
			// console.log("this the subscription :", infoChange);
			const changeClient = infoChange?.data?.data?.onClientChange;
			const { eventType, clientChanges } = changeClient;
			// console.log("New data from subscription:", changeClient);
			if (eventType === "CLIENT_ADDED") {
				// Handle new client addition
				setClients(prevClients => [...prevClients, clientChanges]);
			} else if (eventType === "CLIENT_UPDATED") {
				// Handle client update
				setClients(prevClients => prevClients.map(c => (c.id === clientChanges.id ? clientChanges : c)));
			} else if (eventType === "CLIENT_DELETED") {
				// Handle client deletion
				setClients(prevClients => prevClients.filter(c => c.id !== clientChanges.id));
			}
		},
		onComplete: complete => console.log("subscription completed", complete),
	});

	return (
		<div className="children-content">
			<h1>Clientes</h1>
			<input type="text" className="filter" placeholder="Filtrar Por Nombre" onChange={e => setSearch(e.target.value)} />

			{loading ? (
				<h1>loading</h1>
			) : (
				<table>
					<thead>
						<tr className="table-header">
							{windowWidth > 500 ? (
								<th>
									<h2>ID</h2>
								</th>
							) : null}
							<th>
								<h2>Nombre </h2>
							</th>
							<th>
								<h2>Teléfono(s)</h2>
							</th>
						</tr>
					</thead>
					<tbody>
						{clients
							.filter((c, idx) => c?.clientName?.toLowerCase()?.includes(search?.toLowerCase()) || c?.clientLastName?.toLowerCase()?.includes(search?.toLowerCase()))
							.map(c => {
								return (
									<tr key={c?.id} className="table-data">
										{windowWidth > 500 ? (
											<td>
												<Link to={`/${c?.id}`}>
													<p className="link-connection">{c?.id}</p>
												</Link>
											</td>
										) : null}

										<td>
											<Link to={`/${c?.id}`}>
												<p className="link-connection">{c?.clientName + " " + c?.clientLastName}</p>
											</Link>
										</td>
										<td className="table-multi-data">{c?.cellPhones[0]?.number}</td>
									</tr>
								);
							})}
					</tbody>
				</table>
			)}
		</div>
	);
}

export default GetAllClients; // Export the GetAllList component
