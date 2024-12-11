import React, { useEffect } from 'react';
import { useStore } from './store/useStore';
import { Header } from './components/layout/Header';
import { Dashboard } from './components/dashboard/Dashboard';
import { LoadingScreen } from './components/ui/LoadingScreen';
import { ErrorScreen } from './components/ui/ErrorScreen';

export default function App() {
  const { 
    fetchTeamStats,
    fetchBattleLog,
    loading,
    error 
  } = useStore();

  useEffect(() => {
    // Fetch initial data
    fetchTeamStats();
    fetchBattleLog();

    // Set up periodic refresh
    const refreshInterval = setInterval(() => {
      fetchTeamStats();
      fetchBattleLog();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(refreshInterval);
  }, [fetchTeamStats, fetchBattleLog]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-900 to-forest-800">
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-10"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?ixlib=rb-4.0.3")'
        }}
      />
      <Header />
      <Dashboard />
    </div>
  );
}