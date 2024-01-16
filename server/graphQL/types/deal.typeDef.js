const { gql } = require("apollo-server-express");

require("./dateTime");
const { clientTypeDef } = require("./client.typeDef");
const { vehicleTypeDef } = require("./vehicle.typeDef");

const dealTypeDef = gql`
	${clientTypeDef}
	${vehicleTypeDef}

	#Object

	type PaymentDate {
		payment_id: ID!
		monthFullyPay: Boolean!
		isLate: Boolean!
		dateOfPayment: DateTime!
		hasToPay: Float!
		amountPayedThisMonth: Float!
		remainingBalance: Float!
		latenessFee: Float!
		daysLate: Int!
	}

	type Deal {
		id: ID!
		dayOfDeal: String!
		downPayment: Float!
		payment: Float!
		paymentDates: [PaymentDate]!
		remainingBalance: Float!
		sellingPrice: Float!
		client_id: Client!
		vehicle_id: Vehicle!
		createdAt: DateTime!
		updatedAt: DateTime!
	}

	input PaymentDateInput {
		payment_id: ID
		monthFullyPay: Boolean!
		isLate: Boolean!
		dateOfPayment: DateTime!
		hasToPay: Float!
		amountPayedThisMonth: Float!
		remainingBalance: Float!
		latenessFee: Float!
		daysLate: Int!
	}

	#Queries
	type Query {
		hello: String
		getAllDeals: [Deal!]!
		getOneDeal(id: ID!): Deal!
	}

	#mutations
	type Mutation {
		createOneDeal(
			dayOfDeal: String!
			downPayment: Float!
			payment: Float!
			paymentDates: [PaymentDateInput]!
			remainingBalance: Float!
			sellingPrice: Float!
			client_id: ID!
			vehicle_id: ID!
		): Deal!

		updateOneDeal(
			id: ID!
			downPayment: Float
			payment: Float
			paymentDates: [PaymentDateInput]
			remainingBalance: Float
			sellingPrice: Float
		): Deal!

		updateOneDealPayment(
			id: ID!
			payment_id: ID
			amountPayedThisMonth: Float!
		): Deal!

		deleteOneDeal(id: ID!): Deal!
	}
`;

module.exports = { dealTypeDef };
