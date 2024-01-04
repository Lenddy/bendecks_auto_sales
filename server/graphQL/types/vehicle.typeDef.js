const { gql } = require("apollo-server-express");

// use this video to fix the dates https://www.youtube.com/watch?v=XkJVYrZaZ9c

const vehicleTypeDef = gql`
	#scalar Date

	#Object
	type Vehicle {
		id: ID!
		vehicleName: String!
		vehicleModel: String!
		year: String!
		color: [String]
		boughtPrice: Float
		createdAt: String!
		updatedAt: String!
	}

	#Queries
	type Query {
		hello: String
		getAllVehicles: [Vehicle!]!
		getOneVehicle(id: ID!): Vehicle!
	}

	#mutations
	type Mutation {
		createOneVehicle(
			vehicleName: String!
			vehicleModel: String!
			year: String!
			color: [String]
			boughtPrice: Float
		): Vehicle!

		updateOneVehicle(
			id: ID!
			vehicleName: String
			vehicleModel: String
			year: String
			color: [String]
			boughtPrice: Float
		): Vehicle!

		deleteOneVehicle(id: ID!): Vehicle!
	}
`;

module.exports = { vehicleTypeDef };
