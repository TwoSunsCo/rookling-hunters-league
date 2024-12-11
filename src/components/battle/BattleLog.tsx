import React from 'react';
import { Scroll } from 'lucide-react';
import { Card } from '../ui/Card';
import { useStore } from '../../store/useStore';

export function BattleLog() {
  const { battleLog } = useStore();

  return (
    <Card className="p-6 bg-gradient-to-br from-gray-900/90 to-gray-800/90">
      <div className="flex items-center gap-2 mb-6">
        <Scroll className="w-6 h-6 text-red-500" />
        <h2 className="text-2xl font-bold text-gray-200">Battle Log</h2>
      </div>

      <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar">
        {battleLog.map((log) => (
          <div
            key={log.id}
            className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50
                     backdrop-blur-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <p className="font-semibold text-gray-200">{log.hunter}</p>
              <span className="text-sm text-gray-400">
                {new Date(log.timestamp).toLocaleTimeString()}
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-1">
              Location: {log.location}
            </p>
            {log.notes && (
              <p className="text-sm text-gray-500 italic">
                "{log.notes}"
              </p>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}