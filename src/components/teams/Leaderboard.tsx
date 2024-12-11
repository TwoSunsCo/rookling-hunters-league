import React from 'react';
import { Crown, Sword } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Card } from '../ui/Card';

export function Leaderboard() {
  const { teamStats } = useStore();
  const sortedTeams = [...teamStats].sort((a, b) => b.totalKills - a.totalKills);

  return (
    <Card className="p-6 bg-gradient-to-br from-gray-900/90 to-gray-800/90">
      <div className="flex items-center gap-2 mb-6">
        <Crown className="w-6 h-6 text-yellow-500" />
        <h2 className="text-2xl font-bold text-gray-200">Guild Rankings</h2>
      </div>

      <div className="space-y-4">
        {sortedTeams.map((team, index) => (
          <div
            key={team.team}
            className="flex items-center justify-between p-4 
                     bg-gray-800/50 rounded-lg border border-gray-700/50
                     backdrop-blur-sm transition-all duration-300
                     hover:bg-gray-700/50"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-gray-400">
                #{index + 1}
              </span>
              <div>
                <p className="font-semibold capitalize text-gray-200">
                  {team.team} Guild
                </p>
                <p className="text-sm text-gray-400">
                  Champion: {team.topKiller}
                </p>
              </div>
            </div>
            <div className="text-right flex items-center gap-3">
              <Sword className="w-4 h-4 text-gray-400" />
              <div>
                <p className="text-2xl font-bold text-gray-200">{team.totalKills}</p>
                <p className="text-sm text-gray-400">Victories</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}