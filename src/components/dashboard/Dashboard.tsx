import React from 'react';
import { useStore } from '../../store/useStore';
import { TeamCard } from '../teams/TeamCard';
import { Leaderboard } from '../teams/Leaderboard';
import { KillCounter } from '../kills/KillCounter';
import { BattleLog } from '../battle/BattleLog';
import { TeamStatsChart } from '../charts/TeamStatsChart';

export function Dashboard() {
  const { teamStats } = useStore();

  return (
    <main className="relative max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {teamStats.map((stats) => (
          <TeamCard key={stats.team} stats={stats} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <TeamStatsChart />
          <Leaderboard />
        </div>
        <div className="space-y-6">
          <KillCounter />
          <BattleLog />
        </div>
      </div>
    </main>
  );
}