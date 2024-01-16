// Import necessary modules from Apollo Client and custom GraphQL queries
import { useQuery, useSubscription } from "@apollo/client"; // Import useQuery hook to execute GraphQL queries

import { useNavigate, Link, useParams } from "react-router-dom";

import { useState, useEffect } from "react";

import { get_all_deals } from "../../GraphQL/queries/dealQueries";
import io from "socket.io-client"; //importing socket.io-client

function GetAllDeals() {
	const [socket] = useState(() => io(":8080")); //connect to the server
	const navigate = useNavigate();
	const navigateTO = (url) => {
		navigate(url);
	};

	// use promisees to get all the data

	// Fetch data using the useQuery hook by executing the getAllClients query
	const { error, loading, data } = useQuery(get_all_deals);

	// Set up state to manage the Clients fetched from the query
	const [deals, setDeals] = useState([]);

	// Handle subscription using useSubscription hook
	// const { data: subscriptionData } = useSubscription(
	// 	client_added_subscription
	// );

	// useEffect(() => {
	// 	// socket.on("reload_client_list", (newClientInfo) => {
	// 	// 	setClients((prevClients) => [...prevClients, newClientInfo]);
	// 	// 	clients;
	// 	// });
	// 	console.log(delaselas);

	// 	return () => {
	// 		socket.off("reload_client_list"); // Clean up the socket listener on unmount
	// 	};
	// }, [socket]); // Listen to socket changes

	// useEffect hook to handle changes in error, loading, and data states
	useEffect(() => {
		if (loading) {
			console.log("loading"); // Log a message when data is loading
		}
		if (data) {
			console.log(data); // Log the fetched data
			setDeals(data.getAllDeals); // Set the Clients retrieved from the query to the state
			console.log("thissssssss =>>>", data.getAllDeals[1].paymentDates);
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

	return (
		<div>
			<button onClick={() => navigateTO("/deals/add")}>
				{" "}
				add one deal
			</button>

			{deals?.map((d) => {
				return (
					<div key={d?.id}>
						<h1> ID: {d?.id}</h1>
						<p> down payment: {d?.downPayment}</p>
						<div>
							<p>
								paymentDate:
								{d?.paymentDates?.amountPayedThisMonth}{" "}
							</p>
							<p>{}</p>
							{d?.paymentDates?.map((pd, idx) => {
								return (
									<div key={pd.payment_id}>
										<p>Payment id : {pd.payment_id}</p>
										<p>
											Date of Payment: {pd.dateOfPayment}
										</p>
										<p>Amount to Pay: {pd.hasToPay}</p>
										<p>
											Amount Paid This Month:{" "}
											{pd.amountPayedThisMonth}
										</p>
										<p>
											Remaining Balance:{" "}
											{pd.remainingBalance}
										</p>
										<p>
											Is Late: {pd.isLate ? "Yes" : "No"}
										</p>
										<p>Lateness Fee: {pd.latenessFee}</p>
										<p>Days Late: {pd.daysLate}</p>
									</div>
								);
							})}
						</div>
						<p>
							remainingBalance:
							{d?.remainingBalance}
						</p>
						<p>
							remainingBalance:
							{d?.sellingPrice}
						</p>
						<p>client id here: {d?.client_id?.id}</p>
						<p>vehicle id here {d?.vehicle_id?.id}</p>

						<Link to={`/deals/${d.id}`}>
							<button>view</button>
						</Link>
						<Link to={`/deals/update/${d?.id}`}>
							<button>update</button>
						</Link>
						<Link to={`/deals/delete/${d?.id}`}>
							<button>delete</button>
						</Link>
					</div>
				);
			})}
		</div>
	);
}

export default GetAllDeals; // Export the GetAllList component
