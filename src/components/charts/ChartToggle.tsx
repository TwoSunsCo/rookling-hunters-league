import React from 'react';
import { BarChart3, PieChart } from 'lucide-react';
import { clsx } from 'clsx';

interface ChartToggleProps {
  chartType: 'bar' | 'pie';
  onToggle: (type: 'bar' | 'pie') => void;
}

export const ChartToggle: React.FC<ChartToggleProps> = ({ chartType, onToggle }) => {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => onToggle('bar')}
        className={clsx(
          'p-2 rounded-lg transition-colors',
          chartType === 'bar' 
            ? 'bg-gray-700 text-white' 
            : 'text-gray-400 hover:text-gray-200'
        )}
      >
        <BarChart3 className="w-5 h-5" />
      </button>
      <button
        onClick={() => onToggle('pie')}
        className={clsx(
          'p-2 rounded-lg transition-colors',
          chartType === 'pie' 
            ? 'bg-gray-700 text-white' 
            : 'text-gray-400 hover:text-gray-200'
        )}
      >
        <PieChart className="w-5 h-5" />
      </button>
    </div>
  );
};