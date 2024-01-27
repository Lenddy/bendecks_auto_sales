import { gql } from "@apollo/client";

// import(gql);

export const create_one_deal = gql`
	mutation createOneDeal(
		$dayOfDeal: String!
		$downPayment: Float!
		$payment: Float!
		$paymentDates: [PaymentDateInput]!
		$remainingBalance: Float!
		$sellingPrice: Float!
		$client_id: ID!
		$vehicle_id: ID!
	) {
		createOneDeal(
			dayOfDeal: $dayOfDeal
			downPayment: $downPayment
			payment: $payment
			paymentDates: $paymentDates
			remainingBalance: $remainingBalance
			sellingPrice: $sellingPrice
			client_id: $client_id
			vehicle_id: $vehicle_id
		) {
			dayOfDeal
			downPayment
			payment
			remainingBalance
			sellingPrice
			paymentDates {
				monthFullyPay
				isLate
				dateOfPayment
				hasToPay
				amountPayedThisMonth
				remainingBalance
				latenessFee
				daysLate
			}
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

// Define the PaymentDateInput input type
export const PaymentDateInput = gql`
	input PaymentDateInput {
		monthFullyPay: Boolean!
		isLate: Boolean!
		dateOfPayment: DateTime!
		hasToPay: Float!
		AmountPayedThisMonth: Float!
		remainingBalance: Float!
		latenessFee: Float!
		daysLate: Int!
	}
`;

export const update_One_deal = gql`
	mutation updateOneDeal(
		$id: ID!
		$downPayment: Float
		$payment: Float
		$paymentDate: [String!]
		$remainingBalance: Float
		$sellingPrice: Float
	) {
		updateOneDeal(
			id: $id
			downPayment: $downPayment
			payment: $payment
			paymentDate: $paymentDate
			remainingBalance: $remainingBalance
			sellingPrice: $sellingPrice
		) {
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
	mutation updateOneDealPayment(
		$id: ID!
		$payment_id: ID!
		$amountPayedThisMonth: Float!
	) {
		updateOneDealPayment(
			id: $id
			payment_id: $payment_id
			amountPayedThisMonth: $amountPayedThisMonth
		) {
			id
			dayOfDeal
			downPayment
			payment
			remainingBalance
			sellingPrice
			paymentDates {
				payment_id
				monthFullyPay
				isLate
				dateOfPayment
				hasToPay
				amountPayedThisMonth
				remainingBalance
				latenessFee
				daysLate
			}
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

export const delete_one_deal = gql`
	mutation deleteOneDeal($id: ID!) {
		deleteOneDeal(id: $id) {
			id
		}
	}
`;