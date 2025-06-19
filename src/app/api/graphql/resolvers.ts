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
    createPlayer: async (_: ResolverContext, input: CreatePlayerInput) => {
      const { name, club, position, age, marketValue } = input;
      return await prisma.player.create({
        data: {
          name,
          club,
          position,
          age,
          marketValue,
        },
      });
    },
  },
}; 