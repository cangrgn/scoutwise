import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Player {
    id: Int!
    name: String!
    club: String!
    position: String!
    age: Int!
    marketValue: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    players: [Player!]!
    player(id: Int!): Player
  }
`; 