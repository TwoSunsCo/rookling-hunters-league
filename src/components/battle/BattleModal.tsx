import React, { useState } from 'react';
import { Sword, Shield, MapPin, Scroll } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { useStore } from '../../store/useStore';

interface BattleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LOCATIONS = [
  'Misty Hollows',
  'Crystal Caverns',
  'Whispering Woods',
  'Shadow Valley',
  'Ancient Ruins',
];

export function BattleModal({ isOpen, onClose }: BattleModalProps) {
  const { currentUser, addKill } = useStore();
  const [location, setLocation] = useState(LOCATIONS[0]);
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    try {
      await addKill(currentUser.id, { location, notes });
      onClose();
      setNotes('');
    } catch (error) {
      console.error('Failed to record kill:', error);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="relative">
            <Shield className="w-8 h-8 text-red-500" />
            <Sword className="w-6 h-6 text-gray-200 absolute top-1/2 left-1/2 
                          transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <h2 className="text-xl font-medieval font-bold text-gray-200">
            Record Your Victory
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-gray-300 mb-2">
              <MapPin className="w-4 h-4" />
              Battle Location
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2
                       text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              {LOCATIONS.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="flex items-center gap-2 text-gray-300 mb-2">
              <Scroll className="w-4 h-4" />
              Battle Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Describe your glorious victory..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-2
                       text-gray-200 focus:ring-2 focus:ring-red-500 focus:border-red-500
                       h-24 resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full px-6 py-3 bg-gradient-to-r from-red-500 to-red-600
                     text-white rounded-lg hover:from-red-600 hover:to-red-700
                     transition-all duration-300 font-semibold flex items-center
                     justify-center gap-2 shadow-lg hover:shadow-xl"
          >
            <Sword className="w-5 h-5" />
            Record Victory
          </button>
        </form>
      </div>
    </Modal>
  );
}