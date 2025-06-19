'use client';

import { useParams } from 'next/navigation';
import { gql, useQuery } from '@apollo/client';
import PlayerRadarChart from '@/components/charts/PlayerRadarChart';

const GET_PLAYER_BY_ID = gql`
  query GetPlayerById($id: Int!) {
    player(id: $id) {
      id
      name
      club
      position
      age
      marketValue
      goals
      penaltiesScored
      expectedGoals
      shotsTotal
      shotsOnTarget
      shotAccuracyPct
      assists
      expectedAssists
      keyPasses
      passesIntoFinalThird
      progressivePasses
      crosses
      successfulDribbles
      dribbleSuccessPct
      progressiveCarries
      touchesInBox
      miscontrols
      tacklesWon
      interceptions
      blocks
      clearances
      aerialDuelsWonPct
      successfulPressures
      pressureRegains
      pressuresInAttThird
      minutesPlayed
      createdAt
      updatedAt
    }
  }
`;

export default function PlayerDetailPage() {
  const params = useParams();
  let idStr = params.id;
  if (Array.isArray(idStr)) idStr = idStr[0];
  const id = parseInt(idStr, 10);
  const { loading, error, data } = useQuery(GET_PLAYER_BY_ID, { variables: { id } });

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error.message}</div>;
  if (!data?.player) return <div className="p-8">Player not found.</div>;

  const player = data.player;

  return (
    <main className="p-8 max-w-2xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:gap-8 mb-4">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">{player.name}</h1>
          <div className="mb-2 text-gray-700">{player.club} &mdash; {player.position} &mdash; Age: {player.age}</div>
          <div className="mb-4 text-gray-500">Market Value: €{player.marketValue?.toLocaleString()}</div>
        </div>
        <div className="flex-1">
          <PlayerRadarChart player={player} />
        </div>
      </div>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Scoring</h2>
        <div className="grid grid-cols-2 gap-2">
          <div>Goals: <span className="font-medium">{player.goals}</span></div>
          <div>Penalties Scored: <span className="font-medium">{player.penaltiesScored}</span></div>
          <div>Expected Goals: <span className="font-medium">{player.expectedGoals}</span></div>
          <div>Shots Total: <span className="font-medium">{player.shotsTotal}</span></div>
          <div>Shots On Target: <span className="font-medium">{player.shotsOnTarget}</span></div>
          <div>Shot Accuracy %: <span className="font-medium">{player.shotAccuracyPct}</span></div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Playmaking</h2>
        <div className="grid grid-cols-2 gap-2">
          <div>Assists: <span className="font-medium">{player.assists}</span></div>
          <div>Expected Assists: <span className="font-medium">{player.expectedAssists}</span></div>
          <div>Key Passes: <span className="font-medium">{player.keyPasses}</span></div>
          <div>Passes Into Final Third: <span className="font-medium">{player.passesIntoFinalThird}</span></div>
          <div>Progressive Passes: <span className="font-medium">{player.progressivePasses}</span></div>
          <div>Crosses: <span className="font-medium">{player.crosses}</span></div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Possession & Dribbling</h2>
        <div className="grid grid-cols-2 gap-2">
          <div>Successful Dribbles: <span className="font-medium">{player.successfulDribbles}</span></div>
          <div>Dribble Success %: <span className="font-medium">{player.dribbleSuccessPct}</span></div>
          <div>Progressive Carries: <span className="font-medium">{player.progressiveCarries}</span></div>
          <div>Touches In Box: <span className="font-medium">{player.touchesInBox}</span></div>
          <div>Miscontrols: <span className="font-medium">{player.miscontrols}</span></div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Defending</h2>
        <div className="grid grid-cols-2 gap-2">
          <div>Tackles Won: <span className="font-medium">{player.tacklesWon}</span></div>
          <div>Interceptions: <span className="font-medium">{player.interceptions}</span></div>
          <div>Blocks: <span className="font-medium">{player.blocks}</span></div>
          <div>Clearances: <span className="font-medium">{player.clearances}</span></div>
          <div>Aerial Duels Won %: <span className="font-medium">{player.aerialDuelsWonPct}</span></div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Pressing</h2>
        <div className="grid grid-cols-2 gap-2">
          <div>Successful Pressures: <span className="font-medium">{player.successfulPressures}</span></div>
          <div>Pressure Regains: <span className="font-medium">{player.pressureRegains}</span></div>
          <div>Pressures In Att. Third: <span className="font-medium">{player.pressuresInAttThird}</span></div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Meta</h2>
        <div className="grid grid-cols-2 gap-2">
          <div>Minutes Played: <span className="font-medium">{player.minutesPlayed}</span></div>
          <div>Created At: <span className="font-medium">{new Date(player.createdAt).toLocaleString()}</span></div>
          <div>Updated At: <span className="font-medium">{new Date(player.updatedAt).toLocaleString()}</span></div>
        </div>
      </section>
    </main>
  );
} 