import { gql } from "@apollo/client";

export const CLIENT_CHANGE_SUBSCRIPTION = gql`
	subscription onClientChange {
		onClientChange {
			eventType
			clientChanges {
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
	}
`;
export const VEHICLE_CHANGE_SUBSCRIPTION = gql`
	subscription onVehicleChange {
		onVehicleChange {
			eventType
			vehicleChanges {
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
	}
`;

export const DEAL_CHANGE_SUBSCRIPTION = gql`
	subscription {
		onDealChange {
			eventType
			dealChanges {
				id
				downPayment
				payment
				dealPayments {
					payment_id
					dateOfPayment
					daysLate
					hasToPay
					amountPayedThisMonth
					latenessFee
					isLate
					monthFullyPay
				}
				remainingBalance
				totalLatenessFee
				sellingPrice
				carName {
					id
					vehicle
				}
				carModel {
					id
					model
				}
				carColor
				carYear
				client_id {
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
		}
	}
`;
