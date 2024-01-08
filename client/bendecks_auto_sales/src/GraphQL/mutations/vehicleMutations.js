import { gql } from "@apollo/client";

// import(gql);

export const create_one_client = gql`
	mutation createOneVehicle(
		$vehicleName: String!
		$vehicleModel: String!
		$year: String!
		$color: [String]
		$boughtPrice: Float
	) {
		createOneVehicle(
			vehicleName: $vehicleName
			vehicleModel: $clientLastName
			year: $cellPhone
			boughtPrice: $boughtPrice
		) {
			id
			vehicleName
			vehicleModel
			year
			color
			boughtPrice
			createdAt
			updatedAt
		}
	}
`;

export const update_One_client = gql`
	mutation updateOneClient(
		$id: ID!
		$clientName: String
		$clientLastName: String
		$cellPhone: [String]
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

export const delete_one_client = gql`
	mutation deleteOneClient($id: ID!) {
		deleteOneClient(id: $id) {
			id
		}
	}
`;
