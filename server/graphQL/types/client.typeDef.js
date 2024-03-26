const { gql } = require("apollo-server-express");
require("./dateTime");

const clientTypeDef = gql`
	scalar DateTime

	#Object
	type Client {
		id: ID!
		clientName: String!
		clientLastName: String!
		cellPhones: [cellNumber!]!
		createdAt: DateTime!
		updatedAt: DateTime!
	}

	type cellNumber {
		numberId: ID
		number: String!
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

	input cellNumberInput {
		numberId: ID
		number: String!
	}

	input NumberInput {
		numberId: ID
		number: String
		status: String
		# __typename: String
	}

	#mutations
	type Mutation {
		createOneClient(clientName: String!, clientLastName: String!, cellPhones: [cellNumberInput!]!): Client!

		updateOneClient(id: ID!, clientName: String, clientLastName: String, cellPhones: [NumberInput]): Client!

		deleteOneClient(id: ID!): Client!

		deleteOneClientItem(id: ID!, cellPhone: [NumberInput]): Boolean
	}

	#re renders data on data update
	type Subscription {
		onClientChange: ClientChange
	}
`;

module.exports = { clientTypeDef };
