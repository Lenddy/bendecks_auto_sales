// Import necessary modules from Apollo Client and custom GraphQL queries
import { useQuery, useSubscription } from "@apollo/client"; // Import useQuery hook to execute GraphQL queries
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { get_all_deals } from "../../GraphQL/queries/dealQueries";
import { DEAL_CHANGE_SUBSCRIPTION } from "../../GraphQL/subscriptions/subscriptions";

function GetAllDeals() {
	const [windowWidth, setWindowWidth] = useState(window.innerWidth);
	const { error, loading, data, refetch } = useQuery(get_all_deals); // Fetch data using the useQuery hook by executing the getAllClients query;
	const [deals, setDeals] = useState([]);
	const [search, setSearch] = useState("");

	useSubscription(DEAL_CHANGE_SUBSCRIPTION, {
		onError: err => console.log("this is the error from subscription", err),
		onData: infoChange => {
			// console.log("this the deal subscription:", infoChange);
			const changeInfo = infoChange?.data?.data?.onDealChange;
			const { eventType, dealChanges } = changeInfo;
			// console.log("New data from deal subscription:", changeInfo);

			if (eventType === "DEAL_ADDED") {
				// Handle new client addition
				// console.log("added hit", dealChanges);
				// setBackUp(changeInfo);
				setDeals(prev => [...prev, dealChanges]);
				// console.log("this is updated deals", deals);
			} else if (eventType === "DEAL_UPDATED") {
				// console.log("updated hit");
				// Handle client update
				setDeals(prev => prev.map(d => (d.id === dealChanges.id ? dealChanges : d)));
			} else if (eventType === "DEAL_DELETED") {
				// console.log("delete hit", dealChanges);
				// Handle client deletion
				setDeals(prev => prev.filter(d => d.id !== dealChanges.id));
			}
			//  else {
			// 	console.log("Unknown event type");
			// }
			// console.log("back up here ", backUp);
		},
		onComplete: complete => console.log("subscription completed", complete),
	});

	// const { data: subscriptionData, error: subscriptionError } = useSubscription(DEAL_CHANGE_SUBSCRIPTION);

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

	// useEffect hook to handle changes in error, loading, and data states
	useEffect(() => {
		if (loading) {
			// console.log("loading"); // Log a message when data is loading
		}
		if (data) {
			// console.log(data); // Log the fetched data
			setDeals(data.getAllDeals); // Set the Clients retrieved from the query to the state
		}
		if (error) {
			// console.log("there was an error", error); // Log an error message if an error occurs
		}

		const fetchData = async () => {
			await refetch();
		};
		fetchData();
	}, [error, loading, data, refetch]); // Dependencies for the useEffect hook
	// subscriptionError, subscriptionData,

	const pendingPayment = idx => {
		return deals?.[idx]?.dealPayments?.filter(pd => pd?.monthFullyPay === false)?.length;
	};

	const calculateLateClass = paymentDate => {
		if (paymentDate >= 45) {
			return "late-danger";
		} else if (paymentDate >= 15) {
			return "late-alert";
		} else if (paymentDate >= 1) {
			return "late-warning";
		} else {
			return "not-late";
		}
	};

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
						?.filter(d => d?.client_id?.clientName?.toLowerCase()?.includes(search?.toLowerCase()) || d?.client_id?.clientLastName?.toLowerCase()?.includes(search.toLowerCase()))
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
										<Link to={`/deal/${d.id}`}>
											<p className="link-connection">
												{d?.client_id?.clientName} {d?.client_id?.clientLastName}
											</p>
										</Link>
									</td>
									<td className={`table-multi-data `}>
										<Link to={`/deal/${d.id}`}>
											<p className={`link-connection ${calculateLateClass(d?.dealPayments?.find(p => !p.monthFullyPay)?.daysLate)}`}>{d?.dealPayments.find(p => !p.monthFullyPay)?.dateOfPayment}</p>
										</Link>
									</td>
									{windowWidth > 400 ? (
										<td className="table-multi-data">
											<p className="">{pendingPayment(idx)}</p>
											{/* <p>place holder</p> */}
										</td>
									) : null}
									{windowWidth > 400 ? (
										<td className={`table-multi-data ${calculateLateClass(d?.dealPayments?.find(p => !p.monthFullyPay)?.daysLate)}`}>
											<p className="">{d?.dealPayments?.find(p => !p.monthFullyPay)?.daysLate}</p>
											{/* <p className="">0</p> */}
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
