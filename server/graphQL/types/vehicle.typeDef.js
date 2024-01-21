const { gql } = require("apollo-server-express");
require("./dateTime");

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
		createdAt: DateTime!
		updatedAt: DateTime!
	}

	type VehicleChange {
		eventType: String
		vehicleChanges: Vehicle
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

	#re renders data on data update
	type Subscription {
		onVehicleChange: VehicleChange
	}
`;

module.exports = { vehicleTypeDef };
