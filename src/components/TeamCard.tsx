import React from 'react';
import { Sword } from 'lucide-react';
import type { TeamStats } from '../types';
import { Card } from './ui/Card';
import { clsx } from 'clsx';

interface TeamCardProps {
  stats: TeamStats;
}

const teamColors = {
  red: 'from-red-600/90 to-red-700/90 border-red-400',
  blue: 'from-blue-500/90 to-blue-600/90 border-blue-400',
  green: 'from-green-500/90 to-green-600/90 border-green-400',
  yellow: 'from-yellow-500/90 to-yellow-600/90 border-yellow-400',
};

export const TeamCard: React.FC<TeamCardProps> = ({ stats }) => {
  return (
    <Card className={clsx(
      'p-6 border-2 bg-gradient-to-br text-white',
      teamColors[stats.team]
    )}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-2xl font-bold capitalize font-medieval">{stats.team} Guild</h3>
        <Sword className="w-8 h-8 transform rotate-45" />
      </div>
      
      <div className="space-y-2">
        <p className="text-4xl font-bold">{stats.totalKills}</p>
        <p className="text-sm opacity-90">Rooklings Vanquished</p>
        
        <div className="pt-4 border-t border-white/20">
          <p className="text-sm">
            Champion Hunter: <span className="font-semibold">{stats.topKiller}</span>
          </p>
          <p className="text-sm">
            Guild Members: <span className="font-semibold">{stats.memberCount}</span>
          </p>
        </div>
      </div>
    </Card>
  );
};