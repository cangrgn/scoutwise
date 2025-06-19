import { gql } from 'graphql-tag';

export const typeDefs = gql`
  type Player {
    id: Int!
    name: String!
    club: String!
    position: String!
    age: Int!
    marketValue: Int!

    # SCORING
    goals: Float!
    penaltiesScored: Float!
    expectedGoals: Float!
    shotsTotal: Float!
    shotsOnTarget: Float!
    shotAccuracyPct: Float!

    # PLAYMAKING
    assists: Float!
    expectedAssists: Float!
    keyPasses: Float!
    passesIntoFinalThird: Float!
    progressivePasses: Float!
    crosses: Float!

    # POSSESSION & DRIBBLING
    successfulDribbles: Float!
    dribbleSuccessPct: Float!
    progressiveCarries: Float!
    touchesInBox: Float!
    miscontrols: Float!

    # DEFENDING
    tacklesWon: Float!
    interceptions: Float!
    blocks: Float!
    clearances: Float!
    aerialDuelsWonPct: Float!

    # PRESSING
    successfulPressures: Float!
    pressureRegains: Float!
    pressuresInAttThird: Float!

    # META
    minutesPlayed: Int!
    createdAt: String!
    updatedAt: String!
  }

  type Query {
    players: [Player!]!
    player(id: Int!): Player
  }

  input PlayerCreateInput {
    name: String!
    club: String!
    position: String!
    age: Int!
    marketValue: Int!
    goals: Float
    penaltiesScored: Float
    expectedGoals: Float
    shotsTotal: Float
    shotsOnTarget: Float
    shotAccuracyPct: Float
    assists: Float
    expectedAssists: Float
    keyPasses: Float
    passesIntoFinalThird: Float
    progressivePasses: Float
    crosses: Float
    successfulDribbles: Float
    dribbleSuccessPct: Float
    progressiveCarries: Float
    touchesInBox: Float
    miscontrols: Float
    tacklesWon: Float
    interceptions: Float
    blocks: Float
    clearances: Float
    aerialDuelsWonPct: Float
    successfulPressures: Float
    pressureRegains: Float
    pressuresInAttThird: Float
    minutesPlayed: Int
  }

  type Mutation {
    createPlayer(input: PlayerCreateInput!): Player!
  }
`; 