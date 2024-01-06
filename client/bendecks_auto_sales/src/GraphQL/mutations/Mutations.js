import { gql } from "@apollo/client";

// import(gql);

export const create_One_List = gql`
	mutation createOneList(
		$title: String!
		$description: String!
		$isDone: Boolean!
	) {
		createOneList(
			title: $title
			description: $description
			isDone: $isDone
		) {
			id
			title
			description
			isDone
		}
	}
`;

export const update_One_List = gql`
	mutation updateOneList(
		$id: ID!
		$title: String
		$description: String
		$isDone: Boolean
	) {
		updateOneList(
			id: $id
			title: $title
			description: $description
			isDone: $isDone
		) {
			id
			title
			description
			isDone
			# createdAt
			# updateAt
		}
	}
`;

export const delete_One_List = gql`
	mutation deleteOneList($id: ID!) {
		delete_One_ListOneList(id: $id) {
			id
			title
			description
			isDone
		}
	}
`;
