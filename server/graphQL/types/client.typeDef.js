const { gql } = require("apollo-server-express");
require("./dateTime");

const clientTypeDef = gql`
	scalar DateTime

	#Object
	type Client {
		id: ID!
		clientName: String!
		clientLastName: String!
		cellPhone: [String!]!
		createdAt: DateTime!
		updatedAt: DateTime!
	}

	type ClientChange {
		eventType: String
		clientChanges: Client
	}

	#Queries
	type Query {
		hello: String
		getAllClients: [Client!]!
		getOneClient(id: ID!): Client!
	}

	#mutations
	type Mutation {
		createOneClient(
			clientName: String!
			clientLastName: String!
			cellPhone: [String!]!
		): Client!

		updateOneClient(
			id: ID!
			clientName: String
			clientLastName: String
			cellPhone: [String]
		): Client!

		deleteOneClient(id: ID!): Client!
	}

	#re renders data on data update
	type Subscription {
		onClientChange: ClientChange
	}
`;

module.exports = { clientTypeDef };
