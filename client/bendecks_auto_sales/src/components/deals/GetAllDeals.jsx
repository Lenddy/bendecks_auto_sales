// Import necessary modules from Apollo Client and custom GraphQL queries
import { useQuery, useSubscription } from "@apollo/client"; // Import useQuery hook to execute GraphQL queries

import { useNavigate, Link, useParams } from "react-router-dom";

import { useState, useEffect } from "react";

import { get_all_deals } from "../../GraphQL/queries/dealQueries";

function GetAllDeals() {
	const navigate = useNavigate();
	const navigateTO = (url) => {
		navigate(url);
	};

	// Fetch data using the useQuery hook by executing the getAllClients query
	const { error, loading, data } = useQuery(get_all_deals);

	// Set up state to manage the Clients fetched from the query
	const [deals, setDeals] = useState([]);

	// useEffect hook to handle changes in error, loading, and data states
	useEffect(() => {
		if (loading) {
			console.log("loading"); // Log a message when data is loading
		}
		if (data) {
			console.log(data); // Log the fetched data
			setDeals(data.getAllDeals); // Set the Clients retrieved from the query to the state
			// console.log("thissssssss =>>>", data?.getAllDeals[1]?.paymentDates);
		}
		if (error) {
			console.log("there was an error", error); // Log an error message if an error occurs
		}
		// if (subscriptionData && subscriptionData.clientAdded) {
		// 	setClients((prevClients) => [
		// 		...prevClients,
		// 		subscriptionData.clientAdded,
		// 	]);
		// console.log("the subscription work", subscriptionData.clientAdded);
		// }subscriptionData
	}, [error, loading, data, deals]); // Dependencies for the useEffect hook

	// Render the retrieved clients
	const [search, setSearch] = useState("");

	return (
		<div className="children-content">
			<h1>Ventas</h1>
			<input
				type="text"
				className="filter"
				placeholder="filtrar Por Nombre"
				onChange={(e) => setSearch(e.target.value)}
			/>

			<table>
				<thead>
					<tr className="table-header">
						<th>
							<h2>Nombre</h2>
						</th>
						<th>
							<h2>Dia de Pago</h2>
						</th>
					</tr>
				</thead>

				<tbody>
					{deals
						?.filter(
							(d, idx) =>
								d?.client_id?.clientName
									.toLowerCase()
									.includes(search.toLowerCase()) ||
								d?.client_id?.clientLastName
									.toLowerCase()
									.includes(search.toLowerCase())
						)
						.map((d) => {
							return (
								<tr key={d?.id} className="table-data">
									<td>
										<Link to={`/deals/${d.id}`}>
											<p className="link-connection">
												{d?.client_id?.clientName}{" "}
												{d?.client_id?.clientLastName}
											</p>
										</Link>
									</td>
									<td className="table-multi-data">
										<Link to={`/deals/${d.id}`}>
											<p className="link-connection">
												{
													d?.paymentDates.find(
														(p) => !p.monthFullyPay
													)?.dateOfPayment
												}
											</p>
										</Link>
									</td>
								</tr>
							);
						})}
				</tbody>
			</table>
		</div>
	);
}

export default GetAllDeals; // Export the GetAllList component
