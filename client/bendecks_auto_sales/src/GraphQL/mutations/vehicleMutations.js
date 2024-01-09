import { gql } from "@apollo/client";

// import(gql);

export const create_one_vehicle = gql`
	mutation createOneVehicle(
		$vehicleName: String!
		$vehicleModel: String!
		$year: String!
		$color: [String]
		$boughtPrice: Float
	) {
		createOneVehicle(
			vehicleName: $vehicleName
			vehicleModel: $vehicleModel
			year: $year
			color: $color
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

export const update_One_vehicle = gql`
	mutation updateOneVehicle(
		$id: ID!
		$vehicleName: String
		$vehicleModel: String
		$year: String
		$color: [String]
		$boughtPrice: Float
	) {
		updateOneVehicle(
			id: $id
			vehicleName: $vehicleName
			vehicleModel: $vehicleModel
			year: $year
			color: $color
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

export const delete_one_vehicle = gql`
	mutation deleteOneVehicle($id: ID!) {
		deleteOneVehicle(id: $id) {
			id
		}
	}
`;
