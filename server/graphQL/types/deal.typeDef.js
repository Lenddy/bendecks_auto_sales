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
		dealPayments: [DealPayments]!
		remainingBalance: Float!
		totalLatenessFee: Float!
		sellingPrice: Float!
		carName: Car!
		carModel: Model!
		carColor: String
		carYear: String
		boughtPrice: Float
		client_id: Client!
		createdAt: DateTime!
		updatedAt: DateTime!
	}

	type Car {
		id: ID!
		vehicle: String!
	}

	type Model {
		id: ID!
		model: String!
	}

	type DealPayments {
		payment_id: ID!
		dateOfPayment: DateTime!
		daysLate: Int!
		hasToPay: Float!
		amountPayedThisMonth: Float!
		latenessFee: Float!
		isLate: Boolean!
		monthFullyPay: Boolean!
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

	input DealPaymentsInput {
		payment_id: ID
		dateOfPayment: DateTime!
		daysLate: Int!
		hasToPay: Float!
		amountPayedThisMonth: Float!
		latenessFee: Float!
		isLate: Boolean!
		monthFullyPay: Boolean!
	}

	input CarInput {
		id: ID!
		vehicle: String!
	}

	input ModelInput {
		id: ID!
		model: String!
	}

	input AmountPayedInput {
		amount: Float
		dealPayments: [DealPaymentsInput!]
	}

	#mutations
	type Mutation {
		createOneDeal(dayOfDeal: String!, downPayment: Float!, payment: Float!, dealPayments: [DealPaymentsInput!]!, remainingBalance: Float!, sellingPrice: Float!, carName: CarInput!, carModel: ModelInput!, carColor: String, carYear: String, client_id: ID!): Deal!

		updateOneDeal(id: ID!, downPayment: Float, payment: Float, dealPayments: [DealPaymentsInput], remainingBalance: Float, sellingPrice: Float, carName: ModelInput, carModel: ModelInput, carColor: String, carYear: String): Deal!

		updateOneDealPayment(id: ID!, selectedPayments: [DealPaymentsInput!], amountPayed: AmountPayedInput): Deal!

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
