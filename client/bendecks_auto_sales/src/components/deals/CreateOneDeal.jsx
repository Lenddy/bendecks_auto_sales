import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, Link } from "react-router-dom";
import { create_one_deal } from "../../GraphQL/mutations/dealMutations";
import io from "socket.io-client"; //importing socket.io-client
import { get_all_clients } from "../../GraphQL/queries/clientQueries";
import { get_all_vehicles } from "../../GraphQL/queries/vehicleQueries";
import { get_one_deal } from "../../GraphQL/queries/dealQueries";
import moment from "moment";

const CreateOneDeal = ({ reload, setReload }) => {
	// const [socket] = useState(() => io(":8080")); //connect to the server
	const navigate = useNavigate();

	const GetClients = useQuery(get_all_clients);
	const getVehicle = useQuery(get_all_vehicles);
	const [vehicles, setVehicles] = useState([]);
	const [clients, setClients] = useState([]);
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
			console.log(GetClients.data); // Log the fetched data
			setClients(GetClients.data?.getAllClients); // Set the Clients retrieved from the query to the state
		}
		if (getVehicle.data) {
			console.log(getVehicle.data); // Log the fetched data
			setVehicles(getVehicle.data?.getAllVehicles); // Set the Clients retrieved from the query to the state
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
	]); // Dependencies for the useEffect hook

	// Function to handle form submission
	const submit = (e) => {
		e.preventDefault(); // Prevent default form submission behavior

		// console.log("this is the new deal", {
		// 	dayOfDeal: info?.dayOfDeal,
		// 	downPayment: parseFloat(info.downPayment),
		// 	payment: parseFloat(info.payment),
		// 	paymentDates: info?.paymentDates,
		// 	remainingBalance: parseFloat(info?.remainingBalance),
		// 	sellingPrice: parseFloat(info.sellingPrice),
		// 	carName: info?.carName,
		// 	carModel: info?.carModel,
		// 	carColor: info?.carColor,
		// 	carYear: info?.carYear,
		// 	client_id: info?.client_id,
		// });

		createOneDeal({
			variables: {
				dayOfDeal: info?.dayOfDeal,
				downPayment: parseFloat(info.downPayment),
				payment: parseFloat(info.payment),
				paymentDates: info?.paymentDates,
				remainingBalance: parseFloat(info?.remainingBalance),
				sellingPrice: parseFloat(info.sellingPrice),
				carName: info?.carName,
				carModel: info?.carModel,
				carColor: info?.carColor,
				carYear: info?.carYear,
				client_id: info?.client_id,
			},
			refetchQueries: [{ query: get_one_deal }],
		})
			.then((res) => {
				navigate("/deals");
				console.log("here is the response", res.data.createOneDeal);
				// socket.emit("new_client_added", res.data.createOneDeal);
				setReload(!reload);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	useEffect(() => {
		if (
			info?.dayOfDeal &&
			info?.downPayment &&
			info?.payment &&
			info?.sellingPrice
		) {
			const paymentDates = dateCalculator(
				info.dayOfDeal,
				info.downPayment,
				info.payment,
				info.sellingPrice
			);
			setInfo((prevInfo) => ({
				...prevInfo,
				paymentDates: paymentDates,
				remainingBalance:
					paymentDates.length > 0
						? paymentDates[0].remainingBalance
						: prevInfo.sellingPrice - prevInfo.downPayment,
			}));
		}
	}, [info.dayOfDeal, info.downPayment, info.payment, info.sellingPrice]); // Updated dependencies array

	const infoToBeSubmitted = (e) => {
		const { name, value } = e.target;
		console.log(`Selected ${name}: ${value}`); // This will log which field is being updated and its value

		let newValue = value; // Initialize newValue to the value directly
		if (name === "carName" || name === "carModel") {
			// If the name is "vehicle", parse the value into an object
			newValue = JSON.parse(value);
		} else if (
			name === "sellingPrice" ||
			name === "downPayment" ||
			name === "payment"
		) {
			// If it's a numeric field, parse the value into a float
			newValue = parseFloat(value);
		}

		setInfo((prevInfo) => ({
			...prevInfo,
			[name]: newValue,
		}));
	};

	function dateCalculator(initialDate, downPayment, payment, sellPrice) {
		let paymentDates = [];
		let currentDate = moment(initialDate).add(1, "months");
		let remainingBalance = sellPrice - downPayment;

		while (remainingBalance > 0) {
			let amountToPay = Math.min(payment, remainingBalance);

			paymentDates.push({
				monthFullyPay: false,
				isLate: false,
				dateOfPayment: currentDate.format("YYYY-MM-DD"),
				hasToPay: amountToPay,
				remainingBalance: remainingBalance,
				amountPayedThisMonth: 0,
				latenessFee: 0,
				daysLate: 0,
				// latestLatenessFeeUpdate: null,
			});

			remainingBalance -= amountToPay;
			currentDate.add(1, "months");
		}
		return paymentDates;
	}

	// const [selectedVehicle, setSelectedVehicle] = useState();

	// Component rendering
	return (
		<div className="children-content">
			<h1>Nueva Venta</h1>
			<form onSubmit={submit} className="form-create">
				<div className="form-section">
					<div>
						<select
							name="client_id"
							id=""
							onChange={infoToBeSubmitted}
							// className="createOneClientInput"
						>
							<option value="">clients</option>
							{clients?.map((c) => {
								return (
									<option key={c?.id} value={`${c?.id}`}>
										{c?.clientName} {c?.clientLastName}
									</option>
								);
							})}
						</select>
					</div>

					<div>
						<select
							name="carName"
							onChange={infoToBeSubmitted}
							// className="createOneClientInput"
						>
							<option value="">vehicles</option>
							{vehicles?.map((v) => {
								return (
									<option
										key={v?.id}
										value={JSON.stringify({
											id: v?.id,
											vehicle: v.vehicleName,
										})}
									>
										{v?.vehicleName}
									</option>
								);
							})}
						</select>
					</div>

					<div>
						<select
							name="carModel"
							onChange={infoToBeSubmitted}
							// className="createOneClientInput"
						>
							<option disabled selected value="">
								Modelos
							</option>
							{(
								(
									vehicles.find(
										(v) => info?.carName?.id === v?.id
									) || {}
								).vehicleModels || []
							).map((m) => {
								return (
									<option
										key={m?.modelId}
										value={JSON.stringify({
											id: m?.modelId,
											model: m?.model,
										})}
									>
										{m?.model}
									</option>
								);
							})}
						</select>
					</div>

					<div>
						<select
							name="carYear"
							onChange={infoToBeSubmitted}
							// className="createOneClientInput"
						>
							<option disabled selected value="">
								Año
							</option>
							{(
								(
									vehicles.find(
										(v) => info?.carName?.id === v?.id
									) || {}
								).years || []
							).map((y) => {
								return (
									<option key={y?.yearId} value={y?.year}>
										{y?.year}
									</option>
								);
							})}
						</select>
					</div>

					<div>
						<select
							name="carColor"
							onChange={infoToBeSubmitted}
							// className="createOneClientInput"
						>
							<option disabled selected value="">
								color
							</option>
							{(
								(
									vehicles.find(
										(v) => info?.carName?.id === v?.id
									) || {}
								).colors || []
							).map((c) => {
								return (
									<option key={c?.colorId} value={c?.color}>
										{c?.color}
									</option>
								);
							})}
						</select>
					</div>

					<div>
						<input
							type="number"
							step="0.01"
							name="sellingPrice"
							onChange={(e) => {
								infoToBeSubmitted(e);
							}}
							// value={info.cellPhone}
							placeholder="sellingPrice:"
							className="createOneClientInput"
						/>
					</div>

					<div>
						<input
							type="number"
							name="downPayment"
							onChange={(e) => infoToBeSubmitted(e)}
							// value={info.clientName}
							step="0.01"
							maxLength={20}
							// minLength={1}
							placeholder="downPayment:"
							className="createOneClientInput"
						/>
					</div>

					<div>
						<input
							step="0.01"
							type="number"
							name="payment"
							onChange={(e) => infoToBeSubmitted(e)}
							// value={info.clientLastName}
							placeholder="Payment"
							className="createOneClientInput"
						></input>
					</div>
					<div>
						<input
							type="date"
							name="dayOfDeal"
							// onClick={infoToBeSubmitted}
							onChange={(e) => infoToBeSubmitted(e)}
							// value={info.cellPhone}
							placeholder="Date of the deal"
							className="createOneClientInput"
						/>
					</div>

					<div>
						<input
							step="0.01"
							type="number"
							name="remainingBalance"
							onChange={(e) => infoToBeSubmitted(e)}
							disabled
							placeholder={`Balance Pendiente: ${
								parseFloat(info?.remainingBalance) ||
								parseFloat(0.0)
							}`}
							className="createOneClientInput"
						/>
					</div>
				</div>

				<button type="submit" className="submit_btn">
					Agregar Venta
				</button>
			</form>
		</div>
	);
};

export default CreateOneDeal;
