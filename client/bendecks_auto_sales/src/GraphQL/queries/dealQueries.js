import { gql } from "@apollo/client";

// query to get all clients
export const get_all_clients = gql`
	query {
		getAllClients {
			id
			clientName
			clientLastName
			cellPhone
			createdAt
			updatedAt
		}
	}
`;

// query to get one client
export const get_one_client = gql`
	query getOneClient($id: ID!) {
		getOneClient(id: $id) {
			id
			clientName
			clientLastName
			cellPhone
			createdAt
			updatedAt
		}
	}
`;

export const client_added_subscription = gql`
	subscription {
		clientAdded {
			id
			clientName
			clientLastName
			cellPhone
		}
	}
`;
