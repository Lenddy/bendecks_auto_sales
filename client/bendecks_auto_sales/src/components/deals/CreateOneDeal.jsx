import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { create_one_deal } from "../../GraphQL/mutations/dealMutations";
import { get_all_clients } from "../../GraphQL/queries/clientQueries";
import { get_all_vehicles } from "../../GraphQL/queries/vehicleQueries";
import moment from "moment";

const CreateOneDeal = () => {
	const navigate = useNavigate();
	const GetClients = useQuery(get_all_clients);
	const getVehicle = useQuery(get_all_vehicles);
	const [vehicles, setVehicles] = useState([]);
	const [clients, setClients] = useState([]);
	const [validations, setValidations] = useState(false);
	const [info, setInfo] = useState({});

	// Apollo Client mutation hook for creating a single list item
	const [createOneDeal] = useMutation(create_one_deal);

	useEffect(() => {
		if (GetClients.loading) {
			// console.log("loading clients"); // Log a message when data is loading
		}
		if (getVehicle.loading) {
			// console.log("loading vehicles"); // Log a message when data is loading
		}
		if (GetClients.data) {
			// console.log(GetClients.data); // Log the fetched data
			setClients(GetClients.data?.getAllClients); // Set the Clients retrieved from the query to the state
		}
		if (getVehicle.data) {
			// console.log(getVehicle.data); // Log the fetched data
			setVehicles(getVehicle.data?.getAllVehicles); // Set the Clients retrieved from the query to the state
		}
		if (GetClients.error) {
			// console.log("there was an error", GetClients.error); // Log an error message if an error occurs
		}
		if (getVehicle.error) {
			// console.log("there was an error", getVehicle.error); // Log an error message if an error occurs
		}
	}, [GetClients.data, GetClients.error, GetClients.loading, getVehicle.data, getVehicle.error, getVehicle.loading, clients, vehicles]); // Dependencies for the useEffect hook

	useEffect(() => {
		if (info?.dayOfDeal && info?.downPayment && info?.payment && info?.sellingPrice) {
			const dealPayments = dateCalculator(info.dayOfDeal, info.downPayment, info.payment, info.sellingPrice);
			setInfo(prevInfo => ({
				...prevInfo,
				dealPayments: dealPayments,
			}));
		}
	}, [info.dayOfDeal, info.downPayment, info.payment, info.sellingPrice]); // Updated dependencies array

	const infoToBeSubmitted = e => {
		const { name, value } = e.target;
		// console.log(`Selected ${name}: ${value}`); // This will log which field is being updated and its value

		let newValue = value; // Initialize newValue to the value directly
		if (name === "carName" || name === "carModel") {
			// If the name is "vehicle", parse the value into an object
			newValue = JSON.parse(value);
		} else if (name === "sellingPrice" || name === "downPayment" || name === "payment") {
			// If it's a numeric field, parse the value into a float
			newValue = parseFloat(value);
		}

		setInfo(prevInfo => ({
			...prevInfo,
			[name]: newValue,
		}));
	};

	function dateCalculator(initialDate, downPayment, payment, sellPrice) {
		let dealPayments = [];
		let currentDate = moment(initialDate).add(1, "months");
		let remainingBalance = sellPrice - downPayment;
		setInfo({ ...info, remainingBalance: remainingBalance });
		while (remainingBalance > 0) {
			let amountToPay = Math.min(payment, remainingBalance);

			dealPayments.push({
				dateOfPayment: currentDate.format("YYYY-MM-DD"),
				daysLate: 0,
				hasToPay: amountToPay,
				amountPayedThisMonth: 0,
				latenessFee: 0,
				isLate: false,
				monthFullyPay: false,
			});

			remainingBalance -= amountToPay;
			currentDate.add(1, "months");
		}

		return dealPayments;
	}

	const submit = e => {
		e.preventDefault(); // Prevent default form submission behavior

		createOneDeal({
			variables: {
				dayOfDeal: info?.dayOfDeal,
				downPayment: parseFloat(info.downPayment),
				payment: parseFloat(info.payment),
				dealPayments: info?.dealPayments,
				remainingBalance: parseFloat(info?.remainingBalance),
				sellingPrice: parseFloat(info.sellingPrice),
				carName: info?.carName,
				carModel: info?.carModel,
				carColor: info?.carColor,
				carYear: info?.carYear,
				client_id: info?.client_id,
			},
		})
			.then(res => {
				navigate(`/deal/${res?.data?.createOneDeal?.id}`);
				// console.log("here is the response", res.data.createOneDeal);
			})
			.catch(() => {
				// console.error("Mutation error:", error);
				setValidations(true);
			});
	};

	return (
		<div className="children-content">
			<h1>Nueva Venta</h1>
			<form onSubmit={submit} className="form-create">
				<div className="form-section">
					<div className="form-dropdown-input-container ">
						<select name="client_id" id="" onChange={infoToBeSubmitted} className="form-dropdown-input">
							<option value="" selected disabled>
								Seleccionar Cliente
							</option>
							{clients?.map(c => {
								return (
									<option key={c?.id} value={`${c?.id}`}>
										{c?.clientName} {c?.clientLastName}
									</option>
								);
							})}
						</select>
						{info?.client_id == false ? (
							<div className="form-validation-container">
								<p className="input-validation">Cliente Es Requerido</p>
							</div>
						) : null}
						{validations ? (
							<div className="form-validation-container">
								<p className="input-validation">Cliente Es Requerido</p>
							</div>
						) : null}
					</div>

					{info?.client_id ? (
						<div className="form-dropdown-input-container ">
							<select name="carName" onChange={infoToBeSubmitted} className="form-dropdown-input">
								<option value="" selected disabled>
									Seleccionar Vehicles
								</option>
								{vehicles?.map(v => {
									return (
										<option
											key={v?.id}
											value={JSON.stringify({
												id: v?.id,
												vehicle: v.vehicleName,
											})}>
											{v?.vehicleName}
										</option>
									);
								})}
							</select>

							{info?.carName ? null : (
								<div className="form-validation-container">
									<p className="input-validation">vehículo Es Requerido</p>
								</div>
							)}

							{validations ? (
								<div className="form-validation-container">
									<p className="input-validation">vehículo Es Requerido</p>
								</div>
							) : null}
						</div>
					) : null}

					{info?.carName ? (
						<div className="form-dropdown-input-container">
							<select name="carModel" onChange={infoToBeSubmitted} className="form-dropdown-input">
								<option disabled selected value="">
									seleccionar Modelos
								</option>
								{((vehicles.find(v => info?.carName?.id === v?.id) || {}).vehicleModels || []).map(m => {
									return (
										<option
											key={m?.modelId}
											value={JSON.stringify({
												id: m?.modelId,
												model: m?.model,
											})}>
											{m?.model}
										</option>
									);
								})}
							</select>
							{info?.carModel ? null : (
								<div className="form-validation-container">
									<p className="input-validation">Modelo Es Requerido</p>
								</div>
							)}

							{validations ? (
								<div className="form-validation-container">
									<p className="input-validation">Modelo Es Requerido</p>
								</div>
							) : null}
						</div>
					) : null}

					{info?.carModel ? (
						<div className="form-dropdown-input-container">
							<select name="carYear" onChange={infoToBeSubmitted} className="form-dropdown-input">
								<option disabled selected value="">
									Seleccionar Año
								</option>
								{((vehicles.find(v => info?.carName?.id === v?.id) || {}).years || []).map(y => {
									return (
										<option key={y?.yearId} value={y?.year}>
											{y?.year}
										</option>
									);
								})}
							</select>
							{info?.carYear ? null : (
								<div className="form-validation-container">
									<p className="input-validation">Año Es Requerido</p>
								</div>
							)}
							{validations ? (
								<div className="form-validation-container">
									<p className="input-validation">Año Es Requerido</p>
								</div>
							) : null}
						</div>
					) : null}

					{info?.carYear ? (
						<div className="form-dropdown-input-container">
							<select name="carColor" onChange={infoToBeSubmitted} className="form-dropdown-input">
								<option disabled selected value="">
									Seleccionar Color
								</option>
								{((vehicles.find(v => info?.carName?.id === v?.id) || {}).colors || []).map(c => {
									return (
										<option key={c?.colorId} value={c?.color}>
											{c?.color}
										</option>
									);
								})}
							</select>
						</div>
					) : null}

					{info?.carYear ? (
						<div>
							<input
								type="number"
								step="0.01"
								name="sellingPrice"
								onChange={e => {
									infoToBeSubmitted(e);
								}}
								// value={info.cellPhone}
								placeholder="Precio"
								className="form-input"
							/>
							{info?.sellingPrice ? null : (
								<div className="form-validation-container">
									<p className="input-validation">Precio Es Requerido</p>
								</div>
							)}
							{validations ? (
								<div className="form-validation-container">
									<p className="input-validation">Precio Es Requerido</p>
								</div>
							) : null}
						</div>
					) : null}

					{info?.sellingPrice ? (
						<div>
							<input
								type="number"
								name="downPayment"
								onChange={e => infoToBeSubmitted(e)}
								// value={info.clientName}
								step="0.01"
								maxLength={20}
								// minLength={1}
								placeholder="Inicial"
								className="form-input"
							/>
							{info?.downPayment ? null : (
								<div className="form-validation-container">
									<p className="input-validation">Inicial Es Requerido</p>
								</div>
							)}
							{validations ? (
								<div className="form-validation-container">
									<p className="input-validation">Inicial Es Requerido</p>
								</div>
							) : null}
						</div>
					) : null}

					{info?.downPayment ? (
						<div>
							<input
								step="0.01"
								type="number"
								name="payment"
								onChange={e => infoToBeSubmitted(e)}
								// value={info.clientLastName}
								placeholder="Pago"
								className="form-input"
							/>
							{info?.payment ? null : (
								<div className="form-validation-container">
									<p className="input-validation">Pago Es Requerido</p>
								</div>
							)}
							{validations ? (
								<div className="form-validation-container">
									<p className="input-validation">Pago Es Requerido</p>
								</div>
							) : null}
						</div>
					) : null}

					{info?.payment ? (
						<div>
							<input
								type="date"
								name="dayOfDeal"
								// onClick={infoToBeSubmitted}
								onChange={e => infoToBeSubmitted(e)}
								// value={info.cellPhone}
								placeholder="Dia De Venta"
								className="form-input"
							/>
							{info?.dayOfDeal ? null : (
								<div className="form-validation-container">
									<p className="input-validation">Dia DE Venta Es Requerido</p>
								</div>
							)}

							{validations ? (
								<div className="form-validation-container">
									<p className="input-validation">Dia DE Venta Es Requerido</p>
								</div>
							) : null}
						</div>
					) : null}

					<div>
						<input step="0.01" type="number" name="remainingBalance" onChange={e => infoToBeSubmitted(e)} disabled placeholder={`Balance Pendiente: ${parseFloat(info?.remainingBalance) || parseFloat(0.0)}`} className="form-input" />
					</div>
				</div>

				{/* } */}

				<button type="submit" className={`form-submit-btn ${info?.client_id && info?.carName && info?.carModel && info?.carYear && info?.downPayment && info?.payment && info?.dayOfDeal ? "show" : "hide"}`}>
					Agregar Venta
				</button>
			</form>
		</div>
	);
};

export default CreateOneDeal;
