import { gql } from "apollo-server-express";

import(gql);

export const createOneList = gql`
    mutation createOneList($list:{$title:String! $description:String! $isDone:Boolean!}){
        createOneList(list:{{title:$title description:$description isDone:$isDone}) {
        id

        title
        }
    }
`;
