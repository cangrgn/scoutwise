import prisma from '../../../lib/prisma';

export const resolvers = {
  Query: {
    players: async () => {
      return prisma.player.findMany();
    },
    player: async (_: any, args: { id: number }) => {
      return prisma.player.findUnique({ where: { id: args.id } });
    },
  },
}; 