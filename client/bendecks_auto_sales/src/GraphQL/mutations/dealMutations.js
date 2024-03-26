import { gql } from "@apollo/client";

// import(gql);

export const create_one_deal = gql`
	mutation createOneDeal($dayOfDeal: String!, $downPayment: Float!, $payment: Float!, $dealPayments: [DealPaymentsInput!]!, $remainingBalance: Float!, $sellingPrice: Float!, $carName: CarInput!, $carModel: ModelInput!, $carColor: String, $carYear: String, $client_id: ID!) {
		createOneDeal(dayOfDeal: $dayOfDeal, downPayment: $downPayment, payment: $payment, dealPayments: $dealPayments, remainingBalance: $remainingBalance, sellingPrice: $sellingPrice, carName: $carName, carModel: $carModel, carColor: $carColor, carYear: $carYear, client_id: $client_id) {
			id
			downPayment
			payment
			dealPayments {
				payment_id
				dateOfPayment
				daysLate
				hasToPay
				amountPayedThisMonth
				monthFullyPay
				isLate
				latenessFee
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

export const update_One_deal = gql`
	mutation updateOneDeal($id: ID!, $downPayment: Float, $payment: Float, $paymentDate: [String!], $remainingBalance: Float, $sellingPrice: Float) {
		updateOneDeal(id: $id, downPayment: $downPayment, payment: $payment, paymentDate: $paymentDate, remainingBalance: $remainingBalance, sellingPrice: $sellingPrice) {
			id
			downPayment
			payment
			remainingBalance
			sellingPrice
			paymentDate
			client_id {
				id
				clientName
				clientLastName
				cellPhone
			}
			vehicle_id {
				id
				vehicleName
				vehicleModel
				year
				color
				boughtPrice
			}
			createdAt
			updatedAt
		}
	}
`;

export const update_One_deal_payment = gql`
	mutation updateOneDealPayment($id: ID!, $selectedPayments: [DealPaymentsInput!], $amountPayed: AmountPayedInput) {
		updateOneDealPayment(id: $id, selectedPayments: $selectedPayments, amountPayed: $amountPayed) {
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

export const delete_one_deal = gql`
	mutation deleteOneDeal($id: ID!) {
		deleteOneDeal(id: $id)
		# id
	}
`;
