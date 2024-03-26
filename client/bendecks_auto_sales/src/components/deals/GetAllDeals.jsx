// Import necessary modules from Apollo Client and custom GraphQL queries
import { useQuery, useSubscription } from "@apollo/client"; // Import useQuery hook to execute GraphQL queries

import { useNavigate, Link, useParams } from "react-router-dom";

import { useState, useEffect } from "react";

import { get_all_deals } from "../../GraphQL/queries/dealQueries";
import moment from "moment";

function GetAllDeals() {
	const navigate = useNavigate();
	const navigateTO = url => {
		navigate(url);
	};

	const [windowWidth, setWindowWidth] = useState(window.innerWidth);

	// Fetch data using the useQuery hook by executing the getAllClients query
	const { error, loading, data } = useQuery(get_all_deals);

	// Set up state to manage the Clients fetched from the query
	const [deals, setDeals] = useState([]);
	const [search, setSearch] = useState("");

	// useEffect hook to handle changes in error, loading, and data states
	useEffect(() => {
		if (loading) {
			console.log("loading"); // Log a message when data is loading
		}
		if (data) {
			console.log(data); // Log the fetched data
			setDeals(data.getAllDeals); // Set the Clients retrieved from the query to the state
			// console.log("thissssssss =>>>", data?.getAllDeals[1]?.dealPayments);
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

	// Render the retrieved clients

	const pendingPayment = idx => {
		return deals?.[idx]?.dealPayments?.filter(pd => pd?.monthFullyPay === false)?.length;
	};

	const calculateLateClass = paymentDate => {
		// // console.log("this is the payment ", paymentDate);
		const daysLate = moment().diff(moment(paymentDate), "days");
		// setLatenessDays(daysLate);

		if (daysLate >= 45) {
			return "late-danger";
		} else if (daysLate >= 15) {
			return "late-alert";
		} else if (daysLate >= 1) {
			return "late-warning";
		} else {
			return "not-late";
		}
	};

	<table>
		<thead>
			<tr className="table-header">
				{windowWidth > 710 ? (
					<th>
						<h2>ID</h2>
					</th>
				) : null}

				<th>
					<h2>Nombre</h2>
				</th>
				<th>
					<h2>Dia de Pago</h2>
				</th>

				{windowWidth > 400 ? (
					<th>
						<h2>Pagos Pendientes</h2>
					</th>
				) : null}
			</tr>
		</thead>

		<tbody>
			{deals
				?.filter((d, idx) => d?.client_id?.clientName.toLowerCase().includes(search.toLowerCase()) || d?.client_id?.clientLastName.toLowerCase().includes(search.toLowerCase()))
				.map((d, idx) => {
					return (
						<tr key={d?.id} className="table-data">
							{windowWidth > 710 ? (
								<td>
									<Link to={`/deals/${d.id}`}>
										<p className="link-connection">{d.id}</p>
									</Link>
								</td>
							) : null}

							<td>
								<Link to={`/deals/${d.id}`}>
									<p className="link-connection">
										{d?.client_id?.clientName} {d?.client_id?.clientLastName}
									</p>
								</Link>
							</td>
							<td className={`table-multi-data ${calculateLateClass(d?.dealPayments.find(p => !p.monthFullyPay)?.dateOfPayment)}`}>
								<Link to={`/deals/${d.id}`}>
									<p className="link-connection">{d?.dealPayments.find(p => !p.monthFullyPay)?.dateOfPayment}</p>
								</Link>
							</td>
							{windowWidth > 400 ? (
								<td className="table-multi-data">
									<p className="">{pendingPayment(idx)}</p>
								</td>
							) : null}
						</tr>
					);
				})}
		</tbody>
	</table>;

	return (
		<div className="children-content">
			<h1>Ventas</h1>
			<input type="text" className="filter" placeholder="filtrar Por Nombre" onChange={e => setSearch(e.target.value)} />

			<table>
				<thead>
					<tr className="table-header">
						{windowWidth > 710 ? (
							<th>
								<h2>ID</h2>
							</th>
						) : null}

						<th>
							<h2>Nombre</h2>
						</th>
						<th>
							<h2>Dia de Pago</h2>
						</th>

						{windowWidth > 400 ? (
							<th>
								<h2>Pagos Pendientes</h2>
							</th>
						) : null}
						{windowWidth > 400 ? (
							<th>
								<h2>Dias atrasados</h2>
							</th>
						) : null}
					</tr>
				</thead>

				<tbody>
					{deals
						?.filter((d, idx) => d?.client_id?.clientName.toLowerCase().includes(search.toLowerCase()) || d?.client_id?.clientLastName.toLowerCase().includes(search.toLowerCase()))
						.map((d, idx) => {
							return (
								<tr key={d?.id} className="table-data">
									{windowWidth > 710 ? (
										<td>
											<Link to={`/deal/${d.id}`}>
												<p className="link-connection">{d.id}</p>
											</Link>
										</td>
									) : null}

									<td>
										<Link to={`/deals/${d.id}`}>
											<p className="link-connection">
												{d?.client_id?.clientName} {d?.client_id?.clientLastName}
											</p>
										</Link>
									</td>
									<td className={`table-multi-data `}>
										<Link to={`/deal/${d.id}`}>
											<p className={`link-connection ${calculateLateClass(d?.dealPayments.find(p => !p.monthFullyPay)?.dateOfPayment)}`}>{d?.dealPayments.find(p => !p.monthFullyPay)?.dateOfPayment}</p>
										</Link>
									</td>
									{windowWidth > 400 ? (
										<td className="table-multi-data">
											<p className="">{pendingPayment(idx)}</p>
										</td>
									) : null}
									{windowWidth > 400 ? (
										<td className={`table-multi-data ${calculateLateClass(d?.dealPayments.find(p => !p.monthFullyPay)?.dateOfPayment)}`}>
											<p className="">{Math.max(moment().diff(moment(d?.dealPayments.find(p => !p.monthFullyPay)?.dateOfPayment), "days"), 0)}</p>
										</td>
									) : null}
								</tr>
							);
						})}
				</tbody>
			</table>
		</div>
	);
}

export default GetAllDeals; // Export the GetAllList component
