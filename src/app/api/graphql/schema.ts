import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Player {
    id: Int!
    name: String!
    club: String!
    position: String!
    age: Int!
    marketValue: Float!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    players: [Player!]!
    player(id: Int!): Player
  }

  type Mutation {
    createPlayer(
      name: String!
      club: String!
      position: String!
      age: Int!
      marketValue: Float!
    ): Player!
  }
`; 