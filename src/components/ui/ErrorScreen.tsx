import React from 'react';

interface ErrorScreenProps {
  error: string;
}

export function ErrorScreen({ error }: ErrorScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-900 to-forest-800 
                  flex items-center justify-center">
      <div className="text-red-500 text-xl">{error}</div>
    </div>
  );
}