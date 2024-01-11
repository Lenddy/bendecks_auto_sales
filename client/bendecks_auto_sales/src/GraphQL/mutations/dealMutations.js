import { gql } from "@apollo/client";

// import(gql);

export const create_one_deal = gql`
	mutation createOneDeal(
		$downPayment: Float!
		$payment: Float!
		$paymentDate: [String!]!
		$remainingBalance: Float!
		$sellingPrice: Float!
		$client_id: ID!
		$vehicle_id: ID!
	) {
		createOneDeal(
			downPayment: $downPayment
			payment: $payment
			paymentDate: $paymentDate
			remainingBalance: $remainingBalance
			sellingPrice: $sellingPrice
			client_id: $client_id
			vehicle_id: $vehicle_id
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

export const delete_one_deal = gql`
	mutation deleteOneDeal($id: ID!) {
		deleteOneDeal(id: $id) {
			id
		}
	}
`;
