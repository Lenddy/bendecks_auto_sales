const { gql } = require("apollo-server-express");
require("./dateTime");

const vehicleTypeDef = gql`
	#scalar Date

	#Object
	type Vehicle {
		id: ID!
		vehicleName: String!
		vehicleModels: [modelType!]!
		years: [yearType!]!
		colors: [colorType!]!
		boughtPrice: Float
		createdAt: DateTime!
		updatedAt: DateTime!
	}

	type modelType {
		modelId: ID
		model: String
	}

	type yearType {
		yearId: ID
		year: String
	}

	type colorType {
		colorId: ID
		color: String!
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

	input modelInput {
		modelId: ID
		model: String
		status: String
	}

	input yearInput {
		yearId: ID
		year: String
		status: String
	}

	input colorInput {
		colorId: ID
		color: String
		status: String
	}

	#mutations
	type Mutation {
		createOneVehicle(
			vehicleName: String!
			vehicleModels: [modelInput!]!
			years: [yearInput!]!
			colors: [colorInput!]!
			boughtPrice: Float
		): Vehicle!

		updateOneVehicle(
			id: ID!
			vehicleName: String
			vehicleModels: [modelInput]
			years: [yearInput]
			colors: [colorInput]
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
