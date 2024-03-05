import { gql } from "@apollo/client";

// query to get all clients
export const get_all_vehicles = gql`
	query {
		getAllVehicles {
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

// query to get one client
export const get_one_vehicle = gql`
	query getOneClient($id: ID!) {
		getOneVehicle(id: $id) {
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
