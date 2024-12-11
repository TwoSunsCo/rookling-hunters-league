import React from 'react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-900 to-forest-800 
                  flex items-center justify-center">
      <div className="text-white text-xl">Loading...</div>
    </div>
  );
}