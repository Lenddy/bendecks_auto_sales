import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { get_one_vehicle } from "../../GraphQL/queries/vehicleQueries";
import { delete_one_vehicle } from "../../GraphQL/mutations/vehicleMutations";
import { useNavigate, useParams, Link } from "react-router-dom";

const DeleteOneVehicle = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [vehicle, setVehicle] = useState();

	const { error, data, loading } = useQuery(get_one_vehicle, {
		variables: { id },
	});

	useEffect(() => {
		if (loading) {
			console.log("loading");
		}
		if (data) {
			setVehicle(data.getOneVehicle);
		}
		if (error) {
			console.log("there was an error", error);
		}
	}, [error, loading, data, vehicle]);

	const [deleteOneVehicle] = useMutation(delete_one_vehicle);

	const deleteVehicles = () => {
		console.log(id);
		deleteOneVehicle({
			variables: {
				id, // Only pass the ID to the deletion mutation
			},
		})
			.then((res) => {
				// Redirect after successful deletion
				navigate("/vehicles");
				return res.data;
			})
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<div>
			<h1>hello</h1>
			<Link to={"/vehicles"}>
				<button>view vehicles</button>
			</Link>

			<Link to={"/dashboard"}>
				<button>dashboard</button>
			</Link>

			<h1> ID: {vehicle?.id}</h1>
			<p>
				{" "}
				Name and Model : {vehicle?.vehicleName} {vehicle?.vehicleModel}
			</p>
			<p>year: {vehicle?.year}</p>
			<p>
				color(s):{" "}
				{vehicle?.color?.map((c, idx) => {
					return (
						<span key={idx}>
							<span>{c}</span> ,
						</span>
					);
				})}
			</p>

			<div>
				<button onClick={deleteVehicles}>Delete</button>
			</div>
		</div>
	);
};

export default DeleteOneVehicle;
