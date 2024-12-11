import React, { useState } from 'react';
import { Sword, Shield } from 'lucide-react';
import { useStore } from '../store/useStore';
import { Card } from './ui/Card';
import { BattleModal } from './BattleModal';

export const KillCounter: React.FC = () => {
  const { currentUser } = useStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!currentUser) return null;

  return (
    <>
      <Card className="p-6 bg-gradient-to-br from-forest-900/90 to-forest-800/90 border-forest-700">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Shield className="w-12 h-12 text-gray-300" />
            <Sword className="w-8 h-8 text-gray-400 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          
          <div className="text-center">
            <p className="text-3xl font-bold text-gray-200">{currentUser.kills}</p>
            <p className="text-gray-400">Rooklings Vanquished</p>
          </div>
          
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 
                     text-white rounded-lg hover:from-red-600 hover:to-red-700 
                     transition-all duration-300 font-semibold flex items-center gap-2
                     shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <Sword className="w-5 h-5" />
            Record Victory
          </button>
        </div>
      </Card>

      <BattleModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};