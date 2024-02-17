import { gql } from "@apollo/client";

// import(gql);

export const create_one_client = gql`
	mutation createOneClient(
		$clientName: String!
		$clientLastName: String!
		$cellPhone: [String!]!
	) {
		createOneClient(
			clientName: $clientName
			clientLastName: $clientLastName
			cellPhone: $cellPhone
		) {
			id
			clientName
			clientLastName
			cellPhone
		}
	}
`;

export const update_One_client = gql`
	mutation updateOneClient(
		$id: ID!
		$clientName: String
		$clientLastName: String
		$cellPhone: [NumberInput]
	) {
		updateOneClient(
			id: $id
			clientName: $clientName
			clientLastName: $clientLastName
			cellPhone: $cellPhone
		) {
			id
			clientName
			clientLastName
			cellPhone
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
