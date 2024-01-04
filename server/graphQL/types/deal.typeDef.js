const { gql } = require("apollo-server-express");

// use this video to fix the dates https://www.youtube.com/watch?v=XkJVYrZaZ9c

const { clientTypeDef } = require("./client.typeDef");
const { vehicleTypeDef } = require("./vehicle.typeDef");

const dealTypeDef = gql`
	${clientTypeDef}
	${vehicleTypeDef}

	#scalar Date

	#Object
	type Deal {
		id: ID!
		downPayment: Float!
		payment: Float!
		paymentDate: [String!]!
		remainingBalance: Float!
		sellingPrice: Float!
		client_id: Client!
		vehicle_id: Vehicle!
		createdAt: String!
		updatedAt: String!
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
			downPayment: Float!
			payment: Float!
			paymentDate: [String!]!
			remainingBalance: Float!
			sellingPrice: Float!
			client_id: ID!
			vehicle_id: ID!
		): Deal!

		updateOneDeal(
			id: ID!
			downPayment: Float
			payment: Float
			paymentDate: [String!]
			remainingBalance: Float
			sellingPrice: Float
		): Deal!

		deleteOneDeal(id: ID!): Deal!
	}
`;

module.exports = { dealTypeDef };
