import prisma from '@/lib/prisma';

type ResolverContext = {
  _: any;
}

type CreatePlayerInput = {
  name: string;
  club: string;
  position: string;
  age: number;
  marketValue: number;
  goals?: number;
  penaltiesScored?: number;
  expectedGoals?: number;
  shotsTotal?: number;
  shotsOnTarget?: number;
  shotAccuracyPct?: number;
  assists?: number;
  expectedAssists?: number;
  keyPasses?: number;
  passesIntoFinalThird?: number;
  progressivePasses?: number;
  crosses?: number;
  successfulDribbles?: number;
  dribbleSuccessPct?: number;
  progressiveCarries?: number;
  touchesInBox?: number;
  miscontrols?: number;
  tacklesWon?: number;
  interceptions?: number;
  blocks?: number;
  clearances?: number;
  aerialDuelsWonPct?: number;
  successfulPressures?: number;
  pressureRegains?: number;
  pressuresInAttThird?: number;
  minutesPlayed?: number;
}

export const resolvers = {
  Query: {
    players: async () => {
      return await prisma.player.findMany();
    },
    player: async (_: ResolverContext, { id }: { id: number }) => {
      return await prisma.player.findUnique({
        where: { id },
      });
    },
  },
  Mutation: {
    createPlayer: async (_: ResolverContext, { input }: { input: CreatePlayerInput }) => {
      return await prisma.player.create({
        data: {
          ...input,
        },
      });
    },
  },
}; 