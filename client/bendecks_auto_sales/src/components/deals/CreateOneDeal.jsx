import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate } from "react-router-dom";
import { create_one_deal } from "../../GraphQL/mutations/dealMutations";
import { get_all_clients } from "../../GraphQL/queries/clientQueries";
import { get_all_vehicles } from "../../GraphQL/queries/vehicleQueries";
import moment from "moment";
import CreateOneClient from "../clients/CreateOneClient";
import GetOneClient from "../clients/GetOneClient";
import CreateOneVehicle from "../vehicles/CreateOneVehicle";
import GetOneVehicle from "../vehicles/GetOneVehicle";

const CreateOneDeal = ({ cid }) => {
	const navigate = useNavigate();
	const GetClients = useQuery(get_all_clients);
	const getVehicle = useQuery(get_all_vehicles);
	const [vehicles, setVehicles] = useState([]);
	const [clients, setClients] = useState([]);
	const [validations, setValidations] = useState(false);
	const [info, setInfo] = useState({});
	const [newClient, setNewClient] = useState({ showClientCreate: false, ShowClientUpdate: false, clientId: null });
	const [newVehicle, setNewVehicle] = useState({ showVehicleCreate: false, ShowVehicleUpdate: false, vehicleId: null });
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
			if (name === "carName") {
				setNewVehicle({ vehicleId: newValue.id, showVehicleCreate: false, ShowVehicleUpdate: true });
			}
		} else if (name === "sellingPrice" || name === "downPayment" || name === "payment") {
			// If it's a numeric field, parse the value into a float
			newValue = parseFloat(value);
		} else if (name === "client_id") {
			// If it's a numeric field, parse the value into a float
			setNewClient({ clientId: newValue, showClientCreate: false, ShowClientUpdate: true });
			console.log("\x1b[32m green send id ", newClient.clientId);
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

	const handleKeyDown = e => {
		const { keyCode } = e;
		const isNumericKey = (keyCode >= 48 && keyCode <= 57) || (keyCode >= 96 && keyCode <= 105); // Numeric keys (0-9)
		const isDeleteKey = keyCode === 8 || keyCode === 46; // Backspace or delete key codes
		const isMaxLength = e.target.value.length >= 4;

		// Allow only numeric keys and delete keys, and limit the input to a maximum length of 4
		if (!(isNumericKey || isDeleteKey) || (isMaxLength && !isDeleteKey)) {
			e.preventDefault();
		}
		// else {
		// 	// Update the info state with the current value being typed
		// 	setInfo(prevInfo => ({
		// 		...prevInfo,
		// 		[e.target.name]: e.target.value,
		// 	}));
		// }
	};

	/* make btns to show other creates so that if they want to add a new client / vehicle they can doing from the create deals and al so make different stages one to create one fully and anoter for updates like if the client already exist allow it to be eble to be edited  and also for the vehicles al aswell so just grap what you already have from the vehicles and the clients and just add a update and create method here   when a client is chosen or vehicle is chosen   show some detais of that item and also allow it to be editable like in the get one  so make a funtion taht allow you to get that client or vehicle if it exixt and just make it editable    and if you need to create on just make a btn that says create one and show the inputs to be inputed just copy and pate what you have on the creates  and on the get ones ans also pput this info in the get one deal 	*/

	//todo you have to find a way to be able to make the new ly addy client and vehicle automaticaly be seceltes and also show teir information  an idea is to just refecth the data here or use the sub to add it to the drop downs and

	//  and make the better drop downs with the search feature
	return (
		<div className="children-content">
			{/* <div className="multi-btn-container">
				<button className="form-submit-btn" type="button" onClick={() => setNewClient({ ...newClient, showClientCreate: true, ShowClientUpdate: false })}>
					Agregar Cliente
				</button>
				<button className="form-submit-btn" type="button" onClick={() => setNewVehicle({ ...newVehicle, showVehicleCreate: true, ShowVehicleUpdate: false })}>
					Agregar vehículo
				</button>
			</div> */}

			<div className="multi-section-container">
				{/* {newClient.showClientCreate ? (
					<div>
						<CreateOneClient redirect={false} />
					</div>
				) : newClient.ShowClientUpdate && newClient.clientId !== null ? (
					<div>
						<GetOneClient requestedClient={newClient.clientId} />
					</div>
				) : null} */}

				<div>
					<h1>Nueva Venta</h1>
					<form onSubmit={submit} className="form-create">
						<div className="form-section">
							<div className="form-dropdown-input-container ">
								<select name="client_id" id="" onChange={infoToBeSubmitted} className="form-dropdown-input">
									<option selected disabled>
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

							{/* add 2 btns ate the top of the page so that you ca click them to show the create vehicle and client */}

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
									<input
										type="text"
										onChange={e => {
											infoToBeSubmitted(e);
										}}
										onKeyDown={e => handleKeyDown(e)}
										name="carYear"
										placeholder="Año"
										className="form-input"
										maxLength={4}
									/>

									{info?.carYear?.length === 4 ? null : (
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

							{info?.carYear?.length == 4 ? (
								<div>
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

							{info?.carYear?.length == 4 ? (
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

						<button type="submit" className={`form-submit-btn ${info?.client_id && info?.carName && info?.carModel && info?.carYear && info?.downPayment && info?.payment && info?.dayOfDeal ? "show" : "hide"}`}>
							Agregar Venta
						</button>
					</form>
				</div>
				{/* 
				{newVehicle.showVehicleCreate === true ? (
					<div>
						<CreateOneVehicle />
					</div>
				) : newVehicle.ShowVehicleUpdate ? (
					<div>
						<CreateOneVehicle />
					</div>
				) : null} */}
			</div>
		</div>
	);
};

export default CreateOneDeal;
