'use client';

import React from 'react';
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface Player {
  name: string;
  goals: number;
  assists: number;
  successfulDribbles: number;
  keyPasses: number;
  tacklesWon: number;
  interceptions: number;
}

interface PlayerRadarChartProps {
  player: Player;
}

const statLabels = [
  { key: 'goals', label: 'Goals' },
  { key: 'assists', label: 'Assists' },
  { key: 'successfulDribbles', label: 'Dribbles' },
  { key: 'keyPasses', label: 'Key Passes' },
  { key: 'tacklesWon', label: 'Tackles Won' },
  { key: 'interceptions', label: 'Interceptions' },
];

export default function PlayerRadarChart({ player }: PlayerRadarChartProps) {
  const data = statLabels.map(({ key, label }) => ({
    subject: label,
    value: player[key as keyof Player] ?? 0,
  }));

  return (
    <div className="w-full max-w-md mx-auto mb-8">
      <ResponsiveContainer width="100%" aspect={1}>
        <RadarChart data={data} outerRadius="80%">
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" />
          <PolarRadiusAxis angle={30} domain={[0, 'auto']} />
          <Radar
            name={player.name}
            dataKey="value"
            stroke="#39FF14"
            fill="#39FF14"
            fillOpacity={0.4}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
} 