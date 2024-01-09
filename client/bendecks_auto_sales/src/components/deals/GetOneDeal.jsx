// Import necessary modules from Apollo Client and custom GraphQL queries
import { useQuery } from "@apollo/client"; // Import useQuery hook to execute GraphQL queries
import { useNavigate, Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { get_one_deal } from "../../GraphQL/queries/dealQueries";

function GetOneDeal() {
	const { id } = useParams();

	// Fetch data using the useQuery hook by executing the getAllList query
	const { error, loading, data } = useQuery(get_one_deal, {
		variables: { id },
	});

	// Set up state to manage the lists fetched from the query
	const [deals, setDeals] = useState();

	// useEffect hook to handle changes in error, loading, and data states
	useEffect(() => {
		if (loading) {
			console.log("loading"); // Log a message when data is loading
		}
		if (data) {
			console.log(data); // Log the fetched data
			setDeals(data.getOneDeal); // Set the lists retrieved from the query to the state
		}
		if (error) {
			console.log("there was an error", error); // Log an error message if an error occurs
		}
	}, [error, loading, data]); // Dependencies for the useEffect hook

	// Render the retrieved lists
	return (
		<div>
			<Link to={"/dashboard"}>
				<button>dashboard</button>
			</Link>

			<div key={deals?.id}>
				<h1> ID: {deals?.id}</h1>
				<p> down payment: {deals?.downPayment}</p>
				<p>
					payment date:{" "}
					{deals?.paymentDate?.map((pd, idx) => {
						return (
							<span key={idx}>
								<span>{pd}</span> ,
							</span>
						);
					})}
				</p>
				<p>
					remainingBalance:
					{deals?.remainingBalance}
				</p>
				<p>
					remainingBalance:
					{deals?.sellingPrice}
				</p>
				<p>client id here: {deals?.client_id?.id}</p>
				<p>vehicle id here {deals?.vehicle_id?.id}</p>

				<Link to={`/deals/${deals?.id}`}>
					<button>view</button>
				</Link>
				<Link to={`/deals/update/${deals?.id}`}>
					<button>update</button>
				</Link>
				<Link to={`/deals/delete/${deals?.id}`}>
					<button>delete</button>
				</Link>
			</div>
		</div>
	);
}

export default GetOneDeal; // Export the GetAllList component

// {list.map((l, idx) => {})}
