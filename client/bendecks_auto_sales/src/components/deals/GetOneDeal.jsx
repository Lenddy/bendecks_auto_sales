import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams, Link } from "react-router-dom";
import { get_one_deal } from "../../GraphQL/queries/dealQueries";
import { update_One_deal_payment } from "../../GraphQL/mutations/dealMutations";
import { get_all_clients } from "../../GraphQL/queries/clientQueries";
import { get_all_vehicles } from "../../GraphQL/queries/vehicleQueries";

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

	useEffect(() => {
		if (loading) {
			console.log("loading", loading);
		}

		if (data) {
			console.log("data", data);
			setDeal(data.getOneDeal);
		}
		if (error) {
			setNotFound(true);
			console.log("error", error);
		}
	}, [loading, data, error]);

	const submit = (e) => {
		e.preventDefault();

		updateOneDealPayment({
			variables: {
				id,
				selectedPayments: selectedPayment,
				amountPayed: info?.amountPayed,
				// amountPayed||
			},
		})
			.then((res) => {
				console.log(res.data);
				navigate(`/deals/${id}`);
			})
			.catch((error) => {
				console.log("there was an error", error);
			});
	};

	const paymentSelected = (payment_id) => {
		const AllPayments = [];

		for (const payment of deal.paymentDates) {
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

	const infoToBeSubmitted = (e) => {
		const { name, value } = e.target;

		const AllPayments = [];

		for (const payment of deal.paymentDates) {
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
				paymentDates: AllPayments,
			},
		});
	};

	// !show more information of the deals   like the remaining balance and the  name of the deal owner and even the  info of the car

	//! make the second for or payment not be there until a btn is click like another form of payment

	return (
		<div className="getOne">
			{notFound ? (
				<div>
					<h1 className="notFound">
						Venta con ID:<span>{id}</span> no se pudo encontrara
						asegúrese de que sea el id correcto
					</h1>

					<button onClick={() => navigate("/deals")}>regresar</button>
				</div>
			) : (
				<div>
					<h1 className="notFound">{id}</h1>

					<form onSubmit={submit}>
						<div className="oneInfo">
							<label htmlFor="payment_id">payments:</label>
							<select
								name="payment_id"
								id=""
								onChange={(e) => {
									// infoToBeSubmitted(e);
									paymentSelected(e.target.value);
								}}
							>
								<option value="">payments</option>
								{deal?.paymentDates?.map((pd, idx) => {
									if (pd?.monthFullyPay === false) {
										return (
											<option
												key={pd?.payment_id}
												value={pd?.payment_id}
											>
												payment number {idx + 1}:{" "}
												{pd?.hasToPay}
											</option>
										);
									}
								})}
							</select>
							<div>
								<input
									placeholder="cantidad"
									type="number"
									name="amountPayed"
									step={0.01}
									maxLength={20}
									onChange={infoToBeSubmitted}
								/>
							</div>
						</div>
						<button type="submit">update a deal</button>
					</form>
				</div>
			)}
		</div>
	);
}

export default GetOneDeal; // Export the GetAllList component
