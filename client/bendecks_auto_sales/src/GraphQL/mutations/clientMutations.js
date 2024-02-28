import { gql } from "@apollo/client";

// import(gql);

export const create_one_client = gql`
	mutation createOneClient(
		$clientName: String!
		$clientLastName: String!
		$cellPhones: [cellNumberInput!]!
	) {
		createOneClient(
			clientName: $clientName
			clientLastName: $clientLastName
			cellPhones: $cellPhones
		) {
			id
			clientName
			clientLastName
			cellPhones {
				numberId
				number
			}
		}
	}
`;

export const update_One_client = gql`
	mutation updateOneClient(
		$id: ID!
		$clientName: String
		$clientLastName: String
		$cellPhones: [NumberInput]
	) {
		updateOneClient(
			id: $id
			clientName: $clientName
			clientLastName: $clientLastName
			cellPhones: $cellPhones
		) {
			id
			clientName
			clientLastName
			cellPhones {
				numberId
				number
			}
			# createdAt
			# updateAt
		}
	}
`;

// {
// 	id
// 	number
// }
export const delete_one_client = gql`
	mutation deleteOneClient($id: ID!) {
		deleteOneClient(id: $id) {
			id
		}
	}
`;
