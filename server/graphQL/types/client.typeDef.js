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

	# type Subscription {
	# 	clientAdded: Client!
	# }
`;

module.exports = { clientTypeDef };
