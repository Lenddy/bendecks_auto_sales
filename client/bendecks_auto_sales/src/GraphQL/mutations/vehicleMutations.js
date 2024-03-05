import { gql } from "@apollo/client";

// import(gql);

export const create_one_vehicle = gql`
	mutation createOneVehicle(
		$vehicleName: String!
		$vehicleModels: [modelInput!]!
		$years: [yearInput!]!
		$colors: [colorInput!]!
		$boughtPrice: Float
	) {
		createOneVehicle(
			vehicleName: $vehicleName
			vehicleModels: $vehicleModels
			years: $years
			colors: $colors
			boughtPrice: $boughtPrice
		) {
			id
			vehicleName
			vehicleModels {
				modelId
				model
			}
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
		$vehicleModels: [modelInput]
		$years: [yearInput]
		$colors: [colorInput]
		$boughtPrice: Float
	) {
		updateOneVehicle(
			id: $id
			vehicleName: $vehicleName
			vehicleModels: $vehicleModels
			years: $years
			colors: $colors
			boughtPrice: $boughtPrice
		) {
			id
			vehicleName
			vehicleModels {
				modelId
				model
			}
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
