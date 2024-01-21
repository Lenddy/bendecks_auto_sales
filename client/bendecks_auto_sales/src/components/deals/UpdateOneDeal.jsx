import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams, Link } from "react-router-dom";
import { get_one_deal } from "../../GraphQL/queries/dealQueries";
import { update_One_deal_payment } from "../../GraphQL/mutations/dealMutations";
import { get_all_clients } from "../../GraphQL/queries/clientQueries";
import { get_all_vehicles } from "../../GraphQL/queries/vehicleQueries";

const UpdateOneDeal = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const { error, loading, data } = useQuery(get_one_deal, {
		variables: { id },
	});

	const [updateOneDealPayment] = useMutation(update_One_deal_payment);

	const [info, setInfo] = useState({});

	const [deal, setDeal] = useState();

	useEffect(() => {
		if (loading) {
			console.log("loading", loading);
		}

		if (data) {
			console.log("data", data);
			setDeal(data.getOneDeal);
		}
		if (error) {
			console.log("error", error);
		}
	}, [loading, data, error]);

	const infoToBeSubmitted = (e) => {
		const { name, value } = e.target;
		const typeValue =
			name === "amountPayedThisMonth" ? parseFloat(value) : value;
		setInfo((prevInfo) => ({
			...prevInfo,
			[name]: typeValue,
		}));
	};

	const submit = (e) => {
		e.preventDefault();

		updateOneDealPayment({
			variables: {
				id,
				payment_id: info?.payment_id,
				amountPayedThisMonth: info?.amountPayedThisMonth,
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

	return (
		<div>
			<div>
				<Link to={"/deals"}>
					<button>view deals</button>
				</Link>
			</div>
			<form onSubmit={submit}>
				<div>
					<label htmlFor="payment_id">payments:</label>

					<select
						name="payment_id"
						id=""
						onChange={infoToBeSubmitted}
					>
						<option value="">payments</option>
						{deal?.paymentDates?.map((pd, idx) => {
							return (
								<option
									key={pd?.payment_id}
									value={pd?.payment_id}
								>
									payment number {idx + 1}: {pd?.hasToPay}
								</option>
							);
						})}
					</select>
					<div>
						<label htmlFor="amountPayedThisMonth">
							{" "}
							amount payed
						</label>
						<input
							type="number"
							name="amountPayedThisMonth"
							step={0.01}
							maxLength={20}
							onChange={infoToBeSubmitted}
						/>
					</div>
				</div>
				<button type="submit">update a deal</button>
			</form>
		</div>
	);
};

export default UpdateOneDeal;
