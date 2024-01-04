const { gql } = require("apollo-server-express");

// use this video to fix the dates https://www.youtube.com/watch?v=XkJVYrZaZ9c

const clientTypeDef = gql`
	#scalar Date

	#Object
	type Client {
		id: ID!
		clientName: String!
		clientLastName: String!
		cellPhone: [String!]!
		createdAt: String!
		updatedAt: String!
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
`;

module.exports = { clientTypeDef };
