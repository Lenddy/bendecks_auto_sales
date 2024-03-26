import { gql } from "@apollo/client";

// query to get all clients
export const get_all_deals = gql`
	query {
		getAllDeals {
			id
			downPayment
			payment
			dealPayments {
				payment_id
				dateOfPayment
				daysLate
				hasToPay
				monthFullyPay
				latenessFee
				isLate
				amountPayedThisMonth
			}
			remainingBalance
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
					number
				}
			}
			createdAt
			updatedAt
		}
	}
`;

// query to get one client
export const get_one_deal = gql`
	query getOneDeal($id: ID!) {
		getOneDeal(id: $id) {
			id
			downPayment
			payment
			dealPayments {
				payment_id
				dateOfPayment
				daysLate
				hasToPay
				monthFullyPay
				latenessFee
				isLate
				amountPayedThisMonth
			}
			remainingBalance
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
					number
				}
			}
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
