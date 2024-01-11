import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { delete_one_deal } from "../../GraphQL/mutations/dealMutations";
import { get_one_deal } from "../../GraphQL/queries/dealQueries";
import { useNavigate, useParams, Link } from "react-router-dom";

const DeleteOneDeal = () => {
	const { id } = useParams();
	const navigate = useNavigate();

	const [deal, setDeal] = useState();

	const { error, loading, data } = useQuery(get_one_deal, {
		variables: { id },
	});

	useEffect(() => {
		if (loading) {
			console.log("loading");
		}
		if (data) {
			setDeal(data.getOneDeal);
		}
		if (error) {
			console.log("there was an error", error);
		}
	}, [error, loading, data, deal]);

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
			.catch((error) => {
				console.log(error);
			});
	};

	return (
		<div>
			<Link to={"/deals"}>
				<button>dashboard</button>
			</Link>
			<div>
				<h1>delete on deal</h1>
			</div>
			<div>
				<button onClick={deleteDeal}>Delete</button>
			</div>
		</div>
	);
};

export default DeleteOneDeal;
