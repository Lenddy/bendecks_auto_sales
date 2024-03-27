import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams, Link } from "react-router-dom";
import { get_one_deal } from "../../GraphQL/queries/dealQueries";
import { update_One_deal_payment } from "../../GraphQL/mutations/dealMutations";
// import { get_all_clients } from "../../GraphQL/queries/clientQueries";
// import { get_all_vehicles } from "../../GraphQL/queries/vehicleQueries";
import { delete_one_deal } from "../../GraphQL/mutations/dealMutations";

function GetOneDeal() {
	const { id } = useParams();
	const navigate = useNavigate();

	const { error, loading, data } = useQuery(get_one_deal, {
		variables: { id },
	});

	const [updateOneDealPayment] = useMutation(update_One_deal_payment);
	const [info, setInfo] = useState({});
	const [deal, setDeal] = useState();
	const [selectedPayment, setSelectedPayment] = useState();
	const [notFound, setNotFound] = useState(false);
	const [dealDelete, setDealDelete] = useState(false);

	const [deleteOneDeal] = useMutation(delete_one_deal);

	const deleteDeal = () => {
		deleteOneDeal({
			variables: {
				id, // Only pass the ID to the deletion mutation
			},
		})
			.then(() => {
				// Redirect after successful deletion
				navigate("/deals");
			})
			.catch(error => {
				console.log(error);
			});
	};

	useEffect(() => {
		if (loading) {
			// console.log("loading", loading);
		}
		if (data) {
			// console.log("data", data);
			setDeal(data.getOneDeal);
		}
		if (error) {
			setNotFound(true);
			// console.log("error", error);
		}
	}, [loading, data, error]);

	const submit = e => {
		e.preventDefault();

		updateOneDealPayment({
			variables: {
				id,
				selectedPayments: selectedPayment,
				amountPayed: info?.amountPayed,
				// amountPayed||
			},
		})
			.then(res => {
				// navigate(`/deal/${id}`);
				setPaymentMethod(prev => !prev);
				setSelectedPayment(undefined);
				setInfo({});
				console.log(res.data.updateOneDealPayment);
			})
			.catch(() => {
				// console.log("there was an error", error);
			});
	};

	const paymentSelected = payment_id => {
		const AllPayments = [];

		for (const payment of deal.dealPayments) {
			if (!payment.monthFullyPay) {
				// Remove __typename field
				const { __typename, ...paymentWithoutTypename } = payment;
				AllPayments.push(paymentWithoutTypename);
			}
			if (payment.payment_id === payment_id) {
				break; // Stop collecting payments if the payment_id matches the given payment_id
			}
		}
		setSelectedPayment(AllPayments);
		return;
	};

	const infoToBeSubmitted = e => {
		const { name, value } = e.target;

		const AllPayments = [];

		for (const payment of deal.dealPayments) {
			if (!payment.monthFullyPay) {
				// Remove __typename field
				const { __typename, ...paymentWithoutTypename } = payment;
				AllPayments.push(paymentWithoutTypename);
			}
		}
		setInfo({
			// ...prevInfo,
			[name]: {
				amount: parseFloat(value),
				dealPayments: AllPayments,
			},
		});
	};

	const [paymentMethod, setPaymentMethod] = useState(false);

	// const secondaryPaymentMethod = () => {
	// 	setPaymentMethod(prev => !prev);
	// };

	const pendingPayment = () => {
		return deal?.dealPayments?.filter(pd => pd?.monthFullyPay === false).length;
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
			{notFound ? (
				<div>
					<h1>
						Venta con ID:
						<span className="link-connection">{id}</span> no se pudo encontrara asegúrese de que sea el id correcto
					</h1>

					<button onClick={() => navigate("/deals")}>regresar</button>
				</div>
			) : (
				<div className="form-update-container">
					<h1>Pagos De Venta</h1>
					<h1 className="link-connection">{id}</h1>

					<div className="">
						<div className="general-info-container">
							<h2 className="general-info">
								<Link to={`/${deal?.client_id?.id}`} className="link-connection">
									{`${deal?.client_id?.clientName} ${deal?.client_id?.clientLastName}`}
								</Link>
							</h2>

							<h2 className="general-info">
								<Link to={`/vehicles/${deal?.carName?.id}`} className="link-connection">
									{deal?.carName?.vehicle}
								</Link>
								/{deal?.carModel?.model}
							</h2>
							<h2 className="general-info">
								Pagos Pendientes/
								{pendingPayment()}
							</h2>
							<h2 className={`general-info `}>
								Dias de Atraso/
								<span className={`o ${calculateLateClass(deal?.dealPayments?.find(p => !p.monthFullyPay)?.daysLate)}`}>{deal?.dealPayments?.find(p => !p.monthFullyPay)?.daysLate}</span>
							</h2>
						</div>
					</div>

					<form onSubmit={submit} className="form-update">
						<div className="form-dropdown-input-container">
							{paymentMethod ? (
								<div>
									<input
										placeholder="cantidad"
										type="number"
										name="amountPayed"
										// step={0.01}
										maxLength={20}
										onChange={infoToBeSubmitted}
										className="form-input"
									/>
								</div>
							) : (
								<select
									name="payment_id"
									id=""
									className="form-dropdown-input"
									onChange={e => {
										// infoToBeSubmitted(e);
										paymentSelected(e.target.value);
									}}>
									<option selected disabled>
										Seleccionar Pagos
									</option>
									{deal?.dealPayments?.map((pd, idx) => {
										if (pd?.monthFullyPay === false) {
											return (
												<option key={pd?.payment_id} value={pd?.payment_id}>
													Pago {idx + 1}: {pd?.hasToPay}
												</option>
											);
										}
									})}
								</select>
							)}
						</div>

						<div className="form-submit-container">
							<div>
								<button type="submit" className={`form-submit-btn  ${(selectedPayment !== undefined && selectedPayment?.length > 0) || info?.amount || info?.amountPayed?.amount > 0 || isNaN(info?.amountPayed?.amount) === false ? "show" : "hide"} `}>
									Hacer pago
								</button>
							</div>
							<div>
								<button
									type="button"
									className="form-swap-btn"
									onClick={() => {
										setPaymentMethod(prev => !prev);
										setSelectedPayment(undefined);
										setInfo({});
									}}>
									Cambiar Método De Pago
								</button>
							</div>
						</div>
						<div className="confirm-delete-container">
							{dealDelete === false ? (
								<button type="button" className={`form-submit-btn`} onClick={() => setDealDelete(true)}>
									Borrar Venta
								</button>
							) : (
								<div className="confirm-delete-item">
									<div>
										<button type="button" onClick={() => deleteDeal()} className="form-delete-input-section">
											<p> &#10003;</p>
										</button>
									</div>

									<div>
										<button type="button" onClick={() => setDealDelete(false)} className="form-delete-input-section">
											<p> &#10005;</p>
										</button>
									</div>
								</div>
							)}
						</div>
					</form>
				</div>
			)}
		</div>
	);
}

export default GetOneDeal; // Export the GetAllList component
