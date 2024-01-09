import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams } from "react-router-dom";
import { get_one_deal } from "../../GraphQL/queries/dealQueries";
import { update_One_deal } from "../../GraphQL/mutations/dealMutations";

const UpdateOneClient = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const { error, loading, data } = useQuery(update_One_deal, {
		variables: { id },
	});
	const [updateOneDeal] = useMutation(get_one_deal);

	const [info, setInfo] = useState({
		cellPhone: [],
	});

	const [deal, setDeal] = useState();

	useEffect(() => {
		if (!loading && data) {
			setDeal(data.getOneDeal);
		}
	}, [loading, data]);

	const infoToBeSubmitted = (e) => {
		setInfo({
			...info,
			[e.target.name]: e.target.value,
		});
	};

	const submit = (e) => {
		e.preventDefault();

		updateOneDeal({
			variables: {
				id,
				downPayment: info.downPayment,
				payment: info.payment,
				paymentDate: info.paymentDate,
				remainingBalance: info.remainingBalance,
				sellingPrice: info.sellingPrice,
				client_id: info.client_id,
				vehicle_id: info.vehicle_id,
			},
		})
			.then((res) => {
				console.log(res.data);
				navigate(`/${id}`);
			})
			.catch((error) => {
				console.log("there was an error", error);
			});
	};

	return (
		<div>
			<form onSubmit={submit}>
				<div>
					<label htmlFor="downPayment">downPayment:</label>
					<input
						type="number"
						name="downPayment"
						onChange={infoToBeSubmitted}
						// value={info.clientName}
					/>
				</div>
				<div>
					<label htmlFor="payment">payment:</label>
					<input
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
					<label htmlFor="remainingBalance">paymentDate:</label>
					<input
						type="text"
						name="remainingBalance"
						onChange={infoToBeSubmitted}
						// value={info.cellPhone}
					/>
				</div>
				<div>
					<label htmlFor="sellingPrice">paymentDate:</label>
					<input
						type="text"
						name="sellingPrice"
						onChange={infoToBeSubmitted}
						// value={info.cellPhone}
					/>
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
				<button type="submit">Add a new client</button>
			</form>
		</div>
	);
};

export default UpdateOneClient;
