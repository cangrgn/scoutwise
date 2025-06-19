import prisma from '@/lib/prisma';

// Her bir oyuncu objesini temizlemek için tek ve basit bir fonksiyon
const cleanPlayer = (player: any) => {
  if (!player) return null;

  // Tüm sayısal/float alanlar için null kontrolü yap ve 0 ata
  const numericFields = [
    'goals', 'penaltiesScored', 'expectedGoals', 'shotsTotal',
    'shotsOnTarget', 'shotAccuracyPct', 'assists', 'expectedAssists',
    'keyPasses', 'passesIntoFinalThird', 'progressivePasses', 'crosses',
    'successfulDribbles', 'dribbleSuccessPct', 'progressiveCarries',
    'touchesInBox', 'miscontrols', 'tacklesWon', 'interceptions',
    'blocks', 'clearances', 'aerialDuelsWonPct', 'successfulPressures',
    'pressureRegains', 'pressuresInAttThird', 'minutesPlayed', 'marketValue', 'age'
  ];

  for (const field of numericFields) {
    if (player[field] === null || player[field] === undefined) {
      player[field] = 0;
    }
  }

  return player;
};

export const resolvers = {
  Query: {
    players: async () => {
      const dbPlayers = await prisma.player.findMany();
      // Her bir oyuncuyu temizle
      return dbPlayers.map(cleanPlayer);
    },
    player: async (_: any, { id }: { id: string }) => {
      const dbPlayer = await prisma.player.findUnique({
        where: { id: parseInt(id) },
      });
      // Tek oyuncuyu temizle
      return cleanPlayer(dbPlayer);
    },
  },
};