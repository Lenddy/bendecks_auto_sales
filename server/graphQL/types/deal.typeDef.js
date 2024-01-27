const { gql } = require("apollo-server-express");

require("./dateTime");
const { clientTypeDef } = require("./client.typeDef");
const { vehicleTypeDef } = require("./vehicle.typeDef");

const dealTypeDef = gql`
	${clientTypeDef}
	${vehicleTypeDef}

	#Object

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

	type DealChange {
		eventType: String
		dealChanges: Deal
	}

	#Queries
	type Query {
		hello: String
		getAllDeals: [Deal!]!
		getOneDeal(id: ID!): Deal!
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
			payment_id: ID!
			amountPayedThisMonth: Float!
		): Deal!

		isDealPaymentPayed: [Deal!]!

		deleteOneDeal(id: ID!): Boolean!
	}

	#re renders data on data update
	type Subscription {
		onDealChange: DealChange
	}
`;

module.exports = { dealTypeDef };

//!!!!!! check if the reason why the subs for vehicle are not working is becaus of del  because deal is using the vehicle subscrtiption tell chat gpt to check all the files fo tevery types and resolver  later
