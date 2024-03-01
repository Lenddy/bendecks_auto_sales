import { gql } from "@apollo/client";

// import(gql);

export const create_one_vehicle = gql`
	mutation createOneVehicle(
		$vehicleName: String!
		$vehicleModel: String!
		$years: [yearType]
		$colors: [colorInput]
		$boughtPrice: Float
	) {
		createOneVehicle(
			vehicleName: $vehicleName
			vehicleModel: $vehicleModel
			years: $years
			colors: $colors
			boughtPrice: $boughtPrice
		) {
			id
			vehicleName
			vehicleModel
			years {
				yearId
				year
			}
			colors {
				colorId
				color
			}
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
		$years: [yearType]
		$colors: [colorInput]
		$boughtPrice: Float
	) {
		updateOneVehicle(
			id: $id
			vehicleName: $vehicleName
			vehicleModel: $vehicleModel
			years: $years
			colors: $colors
			boughtPrice: $boughtPrice
		) {
			id
			vehicleName
			vehicleModel
			years {
				yearId
				year
			}
			colors {
				colorId
				color
			}
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
