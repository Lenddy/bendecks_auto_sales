import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";
import { create_one_deal } from "../../GraphQL/mutations/dealMutations";
import io from "socket.io-client"; //importing socket.io-client
import { get_all_clients } from "../../GraphQL/queries/clientQueries";
import { get_all_vehicles } from "../../GraphQL/queries/vehicleQueries";

const CreateOneDeal = ({ reload, setReload }) => {
	const [socket] = useState(() => io(":8080")); //connect to the server

	const GetClients = useQuery(get_all_clients);
	const getVehicle = useQuery(get_all_vehicles);
	const [vehicles, setVehicles] = useState([]);
	const [clients, setClients] = useState([]);
	useEffect(() => {
		if (GetClients.loading) {
			console.log("loading clients"); // Log a message when data is loading
		}
		if (getVehicle.loading) {
			console.log("loading vehicles"); // Log a message when data is loading
		}
		if (GetClients.data) {
			console.log(GetClients.data); // Log the fetched data
			setClients(GetClients.data.getAllClients); // Set the Clients retrieved from the query to the state
		}
		if (getVehicle.data) {
			console.log(getVehicle.data); // Log the fetched data
			setVehicles(getVehicle.data.getAllVehicles); // Set the Clients retrieved from the query to the state
		}
		if (GetClients.error) {
			console.log("there was an error", GetClients.error); // Log an error message if an error occurs
		}
		if (getVehicle.error) {
			console.log("there was an error", getVehicle.error); // Log an error message if an error occurs
		}
		// if (subscriptionData && subscriptionData.clientAdded) {
		// 	setClients((prevClients) => [
		// 		...prevClients,
		// 		subscriptionData.clientAdded,
		// 	]);
		// console.log("the subscription work", subscriptionData.clientAdded);
		// }subscriptionData
	}, [
		GetClients.data,
		GetClients.error,
		GetClients.loading,
		getVehicle.data,
		getVehicle.error,
		getVehicle.loading,
		clients,
		vehicles,
	]); // Dependencies for the useEffect hook

	// socket.on("new_connection", (data) => {
	// 	console.log(data);
	// });

	// State to manage form data
	// Dependencies for the useEffect hook
	const [info, setInfo] = useState({
		// title: "",
		// description: "",
		// isDone: false,
		paymentDate: [],
	});

	const navigate = useNavigate();

	// Apollo Client mutation hook for creating a single list item
	const [createOneDeal, { error }] = useMutation(create_one_deal);

	// Function to handle input changes and update state accordingly
	const infoToBeSubmitted = (e) => {
		// const value =
		// 	e.target.type === "checkbox" ? e.target.checked : e.target.value;

		setInfo({
			...info,
			[e.target.name]: e.target.value,
		});
	};

	// Function to handle form submission
	const submit = (e) => {
		e.preventDefault(); // Prevent default form submission behavior

		createOneDeal({
			variables: {
				downPayment: parseFloat(info.downPayment),
				payment: parseFloat(info.payment),
				paymentDate: info.paymentDate,
				remainingBalance: parseFloat(info.remainingBalance),
				sellingPrice: parseFloat(info.sellingPrice),
				client_id: info.client_id,
				vehicle_id: info.vehicle_id,
			},
		})
			.then((res) => {
				// Reset the form fields after successful submission

				// setInfo({
				// 	// title: "",
				// 	// description: "",
				// 	// isDone: false,
				// 	cellPhone: [],
				// });
				navigate("/deals");
				console.log("here is the response", res.data.createOneDeal);
				socket.emit("new_client_added", res.data.createOneDeal);
				setReload(!reload);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	// Component rendering
	return (
		<div>
			<div>
				<Link to={"/deals"}>
					<button>view deals</button>
				</Link>
			</div>
			<form onSubmit={submit}>
				<div>
					<label htmlFor="downPayment">downPayment:</label>
					<input
						type="number"
						name="downPayment"
						onChange={infoToBeSubmitted}
						// value={info.clientName}
						step="0.01"
					/>
				</div>
				<div>
					<label htmlFor="payment">payment:</label>
					<input
						step="0.01"
						type="number"
						name="payment"
						onChange={infoToBeSubmitted}
						// value={info.clientLastName}
					></input>
				</div>
				<div>
					<label htmlFor="paymentDate">paymentDate:</label>
					<input
						type="text"
						name="paymentDate"
						onChange={infoToBeSubmitted}
						// value={info.cellPhone}
					/>
				</div>
				<div>
					<label htmlFor="remainingBalance">remainingBalance:</label>
					<input
						step="0.01"
						type="number"
						name="remainingBalance"
						onChange={infoToBeSubmitted}
						// value={info.cellPhone}
					/>
				</div>
				<div>
					<label htmlFor="sellingPrice">sellingPrice:</label>
					<input
						type="number"
						step="0.01"
						name="sellingPrice"
						onChange={infoToBeSubmitted}
						// value={info.cellPhone}
					/>
				</div>
				<div>
					<label htmlFor="client_id">client_id:</label>

					<select name="client_id" id="" onChange={infoToBeSubmitted}>
						<option value="">clients</option>
						{clients?.map((c) => {
							return (
								<option key={c?.id} value={c?.id}>
									{c?.clientName} {c?.clientLastName}
								</option>
							);
						})}
					</select>
				</div>
				<div>
					<label name="vehicle_id">vehicle_id:</label>
					<select
						name="vehicle_id"
						id=""
						onChange={infoToBeSubmitted}
					>
						<option value="">vehicles</option>
						{vehicles?.map((v) => {
							return (
								<option key={v?.id} value={v?.id}>
									{v?.vehicleName} {v?.vehicleModel}
								</option>
							);
						})}
					</select>
				</div>
				<button type="submit">Add a new client</button>
			</form>
		</div>
	);
};

export default CreateOneDeal;
