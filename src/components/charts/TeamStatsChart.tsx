import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Card } from '../ui/Card';
import { clsx } from 'clsx';
import { TEAM_COLORS } from '../../constants/theme';
import { ChartToggle } from './ChartToggle';
import { renderPieChartLabel } from './utils/chartHelpers';
import type { ChartData } from '../../types';

export const TeamStatsChart: React.FC = () => {
  const [chartType, setChartType] = useState<'bar' | 'pie'>('bar');
  const { teamStats, fetchTeamStats } = useStore();
  
  useEffect(() => {
    fetchTeamStats();
  }, [fetchTeamStats]);

  const data = teamStats.map(team => ({
    name: team.team.charAt(0).toUpperCase() + team.team.slice(1),
    kills: team.totalKills,
    color: TEAM_COLORS[team.team],
  }));

  return (
    <Card className="p-6 bg-gradient-to-br from-gray-900/90 to-gray-800/90">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-200">Guild Statistics</h2>
        <ChartToggle 
          chartType={chartType} 
          onToggle={setChartType} 
        />
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <XAxis 
                dataKey="name" 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <YAxis 
                stroke="#9CA3AF"
                fontSize={12}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.95)',
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '0.5rem',
                  color: '#E5E7EB',
                }}
              />
              <Legend />
              <Bar 
                dataKey="kills" 
                name="Rookling Kills"
                radius={[4, 4, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderPieChartLabel}
                outerRadius={120}
                fill="#8884d8"
                dataKey="kills"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgba(17, 24, 39, 0.95)',
                  border: '1px solid rgba(75, 85, 99, 0.5)',
                  borderRadius: '0.5rem',
                  color: '#E5E7EB',
                }}
              />
              <Legend />
            </PieChart>
          )}
        </ResponsiveContainer>
      </div>
    </Card>
  );
};