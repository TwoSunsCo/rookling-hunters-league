import React, { useState } from 'react';
import { LogIn, Sword } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { LoginModal } from './LoginModal';

export function Header() {
  const { currentUser, logout } = useStore();
  const [showLoginModal, setShowLoginModal] = useState(false);

  return (
    <header className="relative bg-gray-900/50 shadow-lg backdrop-blur-sm border-b border-gray-700/50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Sword className="w-8 h-8 text-red-500" />
          <h1 className="text-2xl font-bold text-gray-100">Rookling Hunter League</h1>
        </div>
        
        {currentUser ? (
          <div className="flex items-center gap-4">
            <span className="text-gray-300">
              Welcome, {currentUser.username}
            </span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-gray-800 text-gray-300 rounded-lg 
                       hover:bg-gray-700 transition-colors"
            >
              Logout
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowLoginModal(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg 
                     hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            Join the Hunt
          </button>
        )}
      </div>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)} 
      />
    </header>
  );
}