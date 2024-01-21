import { gql } from "@apollo/client";

export const CLIENT_CHANGE_SUBSCRIPTION = gql`
	subscription onClientChange {
		onClientChange {
			eventType
			clientChanges {
				id
				clientName
				clientLastName
				cellPhone
				createdAt
				updatedAt
			}
		}
	}
`;
export const VEHICLE_CHANGE_SUBSCRIPTION = gql`
	subscription onVehicleChange {
		onVehicleChange {
			eventType
			vehicleChanges {
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
	}
`;
export const DEAL_CHANGE_SUBSCRIPTION = gql`
	subscription onClientChange {
		onClientChange {
			eventType
			clientChanges {
				id
				clientName
				clientLastName
				cellPhone
				createdAt
				updatedAt
			}
		}
	}
`;
