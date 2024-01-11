import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";
import { create_one_deal } from "../../GraphQL/mutations/dealMutations";
import io from "socket.io-client"; //importing socket.io-client
import { get_all_clients } from "../../GraphQL/queries/clientQueries";
import { get_all_vehicles } from "../../GraphQL/queries/vehicleQueries";
import moment from "moment";

const CreateOneDeal = ({ reload, setReload }) => {
	const [socket] = useState(() => io(":8080")); //connect to the server
	const navigate = useNavigate();

	const GetClients = useQuery(get_all_clients);
	const getVehicle = useQuery(get_all_vehicles);
	const [vehicles, setVehicles] = useState([]);
	const [clients, setClients] = useState([]);
	const [updateCount, setUpdateCount] = useState(0); // New state variable
	// Dependencies for the useEffect hook
	const [info, setInfo] = useState({
		paymentDates: [{}], // Array to hold payment dates,
		// dayOFDeal:
	});

	// Apollo Client mutation hook for creating a single list item
	const [createOneDeal, { error }] = useMutation(create_one_deal);
	const [paymentData, setPaymentData] = useState();

	useEffect(() => {
		if (GetClients.loading) {
			console.log("loading clients"); // Log a message when data is loading
		}
		if (getVehicle.loading) {
			console.log("loading vehicles"); // Log a message when data is loading
		}
		if (GetClients.data) {
			// console.log(GetClients.data); // Log the fetched data
			setClients(GetClients.data.getAllClients); // Set the Clients retrieved from the query to the state
		}
		if (getVehicle.data) {
			// console.log(getVehicle.data); // Log the fetched data
			setVehicles(getVehicle.data.getAllVehicles); // Set the Clients retrieved from the query to the state
		}
		if (GetClients.error) {
			console.log("there was an error", GetClients.error); // Log an error message if an error occurs
		}
		if (getVehicle.error) {
			console.log("there was an error", getVehicle.error); // Log an error message if an error occurs
		}
	}, [
		GetClients.data,
		GetClients.error,
		GetClients.loading,
		getVehicle.data,
		getVehicle.error,
		getVehicle.loading,
		clients,
		vehicles,
		info,
	]); // Dependencies for the useEffect hook

	// Function to handle form submission
	const submit = (e) => {
		e.preventDefault(); // Prevent default form submission behavior

		createOneDeal({
			variables: {
				dayOFdeal: parseInt(info?.dayOFdeal) || parseInt(0),
				downPayment: parseFloat(info.downPayment),
				payment: parseFloat(info.payment),
				paymentDates: info?.paymentDates,
				remainingBalance:
					parseFloat(info?.paymentDates[0]?.remainingBalance) ||
					parseFloat(0),
				sellingPrice: parseFloat(info.sellingPrice),
				client_id: info.client_id,
				vehicle_id: info.vehicle_id,
			},
		})
			.then((res) => {
				navigate("/deals");
				console.log("here is the response", res.data.createOneDeal);
				socket.emit("new_client_added", res.data.createOneDeal);
				setReload(!reload);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	// ???????
	// ???????
	// ???????
	// ???????
	//! fix  when you change  the values in the field after they are initially  enter  and after that make the ui look presentable

	// ???????
	// ???????
	// ???????

	useEffect(() => {
		// Check if all required fields are present
		if (
			info.dayOfDeal &&
			info.downPayment &&
			info.payment &&
			info.sellingPrice &&
			updateCount
		) {
			console.log("got all the payments");

			// Call dateCalculator and update the paymentDates in the info state
			const newPaymentDates = dateCalculator(
				info.dayOfDeal,
				info.downPayment,
				info.payment,
				info.sellingPrice
			);

			setInfo((prevInfo) => ({
				...prevInfo,
				paymentDates: newPaymentDates,
			}));
		}
	}, [
		info.dayOfDeal,
		info.downPayment,
		info.payment,
		info.sellingPrice,
		updateCount,
	]); // Dependencies array

	// const infoToBeSubmitted = (e) => {
	// 	const newInfo = {
	// 		...info,
	// 		[e.target.name]: e.target.value,
	// 		paymentDates: paymentData ? paymentData : [{}],
	// 	};

	// 	setInfo(newInfo);

	// };

	const infoToBeSubmitted = (e) => {
		const { name, value } = e.target;

		setInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
		setUpdateCount((count) => count + 1); // Increment the update count
	};

	function dateCalculator(initialDate, downPayment, payment, sellPrice) {
		console.log(
			`initialDate: ${initialDate},downPayment: ${downPayment},payment: ${payment},sellPrice: ${sellPrice}`
		);
		let paymentDates = [];
		let currentDate = moment(initialDate).add(1, "months");

		// Adjust the remaining balance for the down payment
		let remainingBalance = sellPrice - downPayment;
		setInfo({ remainingBalance });

		while (remainingBalance > 0) {
			// Calculate the amount to pay this month
			let amountToPay = Math.min(payment, remainingBalance);

			// Add payment details to the array
			paymentDates.push({
				// payment_id:1,
				monthFullyPay: false,
				isLate: false,
				dateOfPayment: currentDate.format("YYYY-MM-DD"),
				hasToPay: amountToPay,
				remainingBalance: remainingBalance,
				amountPayedThisMonth: 0,
				latenessFee: 0,
				daysLate: 0,
			});

			// Update the remaining balance
			remainingBalance -= amountToPay;

			// Move to the next month
			currentDate.add(1, "months");
		}
		console.log(paymentDates);
		// setPaymentDates(paymentDates);
		return paymentDates;
	}

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
					<label htmlFor="sellingPrice">sellingPrice:</label>
					<input
						type="number"
						step="0.01"
						name="sellingPrice"
						onChange={(e) => {
							infoToBeSubmitted(e);
						}}
						// value={info.cellPhone}
					/>
				</div>

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
					<label htmlFor="dayOfDeal">Date of the deal:</label>
					<input
						type="date"
						name="dayOfDeal"
						// onClick={infoToBeSubmitted}
						onChange={(e) => infoToBeSubmitted(e)}
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
						disabled
						placeholder={
							parseFloat(info?.remainingBalance) || parseFloat(0)
						}
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
