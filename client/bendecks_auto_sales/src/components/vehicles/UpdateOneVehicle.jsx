import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useNavigate, useParams, Link } from "react-router-dom";
import { get_one_vehicle } from "../../GraphQL/queries/vehicleQueries";
import { update_One_vehicle } from "../../GraphQL/mutations/vehicleMutations";
import { get_all_vehicles } from "../../GraphQL/queries/vehicleQueries";

const UpdateOneVehicle = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const { error, loading, data } = useQuery(get_one_vehicle, {
		variables: { id },
	});

	const [info, setInfo] = useState({
		color: [],
	});

	const [vehicle, setVehicle] = useState();

	useEffect(() => {
		if (!loading && data) {
			setVehicle(data.getOneVehicle);
		}
	}, [loading, data]);

	const [updateOneVehicle] = useMutation(update_One_vehicle);

	const infoToBeSubmitted = (e) => {
		setInfo({
			...info,
			[e.target.name]: e.target.value,
		});
	};

	const submit = (e) => {
		e.preventDefault();

		updateOneVehicle({
			variables: {
				id,
				vehicleName: info.vehicleName,
				vehicleModel: info.vehicleModel,
				year: info.year,
				color: info.color,
				boughtPrice: parseFloat(info.boughtPrice),
			},
			// this is re fetching the data
			refetchQueries: [{ query: get_all_vehicles }],
		})
			.then((res) => {
				console.log(res.data);
				navigate(`/vehicles/${id}`);
			})
			.catch((error) => {
				console.log("there was an error", error);
			});
	};

	return (
		<div>
			{loading ? (
				<p>Loading...</p>
			) : (
				vehicle && (
					<div>
						<Link to={"/vehicles"}>
							<button style={{ margin: "5px" }}>
								view vehicles
							</button>
						</Link>
						<form onSubmit={submit}>
							<div>
								<label htmlFor="vehicleName">
									Vehicle Name:
								</label>
								<input
									type="text"
									name="vehicleName"
									onChange={infoToBeSubmitted}
									placeholder={vehicle.vehicleName}
									// value={info.clientName}
								/>
							</div>
							<div>
								<label htmlFor="vehicleModel">
									Vehicle Model:
								</label>
								<input
									name="vehicleModel"
									onChange={infoToBeSubmitted}
									placeholder={vehicle.vehicleModel}
									// value={info.clientLastName}
								></input>
							</div>
							<div>
								<label htmlFor="year">Year:</label>
								<input
									type="text"
									name="year"
									onChange={infoToBeSubmitted}
									placeholder={vehicle.year}
									// value={info.cellPhone}
								/>
							</div>
							<div>
								<label htmlFor="color">Color:</label>
								<input
									type="text"
									name="color"
									onChange={infoToBeSubmitted}
									placeholder={vehicle.color}
									// value={info.cellPhone}
								/>
							</div>

							<div>
								<label htmlFor="boughtPrice">
									Bought Price:
								</label>
								<input
									type="number"
									name="boughtPrice"
									onChange={infoToBeSubmitted}
									placeholder={vehicle.boughtPrice}
									// value={info.cellPhone}
								/>
							</div>
							<button type="submit">Add a new vehicle</button>
						</form>
					</div>
				)
			)}
		</div>
	);
};

export default UpdateOneVehicle;
