'use client';

import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';

const GET_PLAYERS = gql`
  query GetPlayers {
    players {
      id
      name
      club
      age
      goals
      assists
      minutesPlayed
    }
  }
`;

export default function Home() {
  const { loading, error, data } = useQuery(GET_PLAYERS);

  if (loading) return <div className="min-h-screen bg-[#0A192F] text-gray-200 flex items-center justify-center">Loading...</div>;
  if (error) return <div className="min-h-screen bg-[#0A192F] text-red-400 flex items-center justify-center">Error: {error.message}</div>;

  return (
    <main className="min-h-screen bg-[#0A192F] text-gray-200 px-4 py-8">
      {/* Header */}
      <header className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-2" style={{ color: '#39FF14' }}>Scoutwise</h1>
        <div className="text-lg text-gray-400 font-medium">Intelligence on the Pitch.</div>
      </header>

      {/* Player Cards Grid */}
      <section>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {data.players.map((player: any) => (
            <Link
              key={player.id}
              href={`/player/${player.id}`}
              className="transition-transform duration-200 hover:scale-105 group"
            >
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 group-hover:border-[#39FF14] shadow-md h-full flex flex-col cursor-pointer">
                <div className="mb-2">
                  <div className="text-xl font-semibold text-white mb-1">{player.name}</div>
                  <div className="text-gray-400 text-sm flex gap-2 items-center">
                    <span>{player.club}</span>
                    <span className="mx-1">•</span>
                    <span>Age: {player.age}</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4">
                  <div>
                    <div className="text-sm text-gray-500">Goals</div>
                    <div className="text-lg text-white font-bold">{player.goals}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Assists</div>
                    <div className="text-lg text-white font-bold">{player.assists}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Minutes</div>
                    <div className="text-lg text-white font-bold">{player.minutesPlayed}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
