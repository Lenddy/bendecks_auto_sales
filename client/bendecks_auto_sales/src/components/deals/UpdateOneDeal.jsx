import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams, Link } from "react-router-dom";
import { get_one_deal } from "../../GraphQL/queries/dealQueries";
import { update_One_deal } from "../../GraphQL/mutations/dealMutations";
import { get_all_clients } from "../../GraphQL/queries/clientQueries";
import { get_all_vehicles } from "../../GraphQL/queries/vehicleQueries";

const UpdateOneDeal = () => {
	const { id } = useParams();
	const navigate = useNavigate();
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

	const { error, loading, data } = useQuery(get_one_deal, {
		variables: { id },
	});

	const [updateOneDeal] = useMutation(update_One_deal);

	const [info, setInfo] = useState({
		paymentDate: [],
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
				downPayment: parseFloat(info.downPayment),
				payment: parseFloat(info.payment),
				paymentDate: info.paymentDate,
				remainingBalance: parseFloat(info.remainingBalance),
				sellingPrice: parseFloat(info.sellingPrice),
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
					<label htmlFor="downPayment">downPayment:</label>
					<input
						type="number"
						name="downPayment"
						onChange={infoToBeSubmitted}
						// value={info.clientName}
						placeholder={deal?.downPayment}
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
						placeholder={deal?.payment}
					></input>
				</div>
				<div>
					<label htmlFor="paymentDate">paymentDate:</label>
					<input
						type="date"
						name="paymentDate"
						onChange={infoToBeSubmitted}
						placeholder={deal?.paymentDate}
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
						placeholder={deal?.remainingBalance}
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
						placeholder={deal?.sellingPrice}
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
				<button type="submit">update a deal</button>
			</form>
		</div>
	);
};

export default UpdateOneDeal;
