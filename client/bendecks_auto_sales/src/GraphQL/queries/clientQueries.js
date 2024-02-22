import { gql } from "@apollo/client";

// query to get all clients
export const get_all_clients = gql`
	query {
		getAllClients {
			id
			clientName
			clientLastName
			cellPhones {
				numberId
				number
			}
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
			cellPhones {
				numberId
				number
			}
			createdAt
			updatedAt
		}
	}
`;
