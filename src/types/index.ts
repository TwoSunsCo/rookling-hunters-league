export type Team = 'red' | 'blue' | 'green' | 'yellow';

export interface User {
  id: string;
  username: string;
  team: Team;
  kills: number;
  createdAt?: any; // Firestore Timestamp
  lastKillAt?: any; // Firestore Timestamp
}

export interface TeamStats {
  team: Team;
  totalKills: number;
  memberCount: number;
  topKiller: string;
}

export interface BattleLogEntry {
  id: string;
  hunter: string;
  timestamp: number;
  location: string;
  notes?: string;
}