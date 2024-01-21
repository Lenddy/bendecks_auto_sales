import { gql } from "@apollo/client";

export const CLIENT_CHANGE_SUBSCRIPTION = gql`
	subscription onClientChange {
		onClientChange {
			id
			clientName
			clientLastName
			cellPhone
			createdAt
			updatedAt
		}
	}
`;
