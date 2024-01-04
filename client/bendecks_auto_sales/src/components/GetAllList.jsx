import { useState, useEffect } from "react";

import { useQuery, gql } from "@apollo/client"; // allow use to use a graphql query
import { getAllList } from "../GraphQL/Queries"; //getting the getAllList query

function GetAllList() {
	// you can get information from the fetching of a query
	const { error, loading, data } = useQuery(getAllList);

	const [lists, setLists] = useState([]);
	useEffect(() => {
		if (loading) {
			console.log("loading");
		}
		if (data) {
			console.log(data);
			setLists(data.getAllLists);
		}
		if (error) {
			console.log("there was an error", error);
		}
	}, [error, loading, data]);

	return (
		<div>
			{lists.map((l, idx) => {
				return (
					<div key={idx}>
						<h1> Title: {l.title}</h1>
						<p> Description: {l.description}</p>
						<p>is Done: {l.description == true ? "yes" : "no"}</p>
					</div>
				);
			})}
		</div>
	);
}

export default GetAllList;
