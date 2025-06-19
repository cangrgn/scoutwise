'use client';

import { gql, useQuery } from '@apollo/client';

const GET_PLAYERS = gql`
  query GetPlayers {
    players {
      id
      name
      club
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(GET_PLAYERS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Players</h1>
      <ul className="space-y-2">
        {data.players.map((player: any) => (
          <li key={player.id} className="border p-2 rounded">
            <span className="font-semibold">{player.name}</span> - {player.club}
          </li>
        ))}
      </ul>
    </main>
  );
}
