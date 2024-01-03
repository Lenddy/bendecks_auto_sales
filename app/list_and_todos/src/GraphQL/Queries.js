import { gql } from "@apollo/client";

export const getAllList = gql`
	query {
		getAllLists {
			id
			title
			description
			isDone
			createdAt
			updatedAt
		}
	}
`;
