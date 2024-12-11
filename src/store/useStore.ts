import { create } from 'zustand';
import { AuthService } from '../services/firebase/auth';
import { getUser } from '../services/users';
import { getTeamStats } from '../services/teams';
import { addBattleLogEntry, getRecentBattleLog } from '../services/battleLog';
import type { User, TeamStats, BattleLogEntry, Team } from '../types';

interface Store {
  currentUser: User | null;
  teamStats: TeamStats[];
  battleLog: BattleLogEntry[];
  loading: boolean;
  error: string | null;
  
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string, team: Team) => Promise<void>;
  logout: () => Promise<void>;
  addKill: (userId: string, details?: { location: string; notes?: string }) => Promise<void>;
  fetchTeamStats: () => Promise<void>;
  fetchBattleLog: () => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
  currentUser: null,
  teamStats: [],
  battleLog: [],
  loading: false,
  error: null,

  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const firebaseUser = await AuthService.signIn(email, password);
      if (!firebaseUser) throw new Error('Authentication failed');
      
      const userData = await getUser(firebaseUser.uid);
      if (!userData) throw new Error('User profile not found');
      
      set({ currentUser: userData });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  register: async (email, password, username, team) => {
    try {
      set({ loading: true, error: null });
      const firebaseUser = await AuthService.signUp(email, password, username, team);
      if (!firebaseUser) throw new Error('Registration failed');
      
      const userData = await getUser(firebaseUser.uid);
      if (!userData) throw new Error('User profile not found');
      
      set({ currentUser: userData });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await AuthService.signOut();
      set({ currentUser: null });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  addKill: async (userId, details) => {
    try {
      set({ loading: true, error: null });
      await addBattleLogEntry({
        hunter: get().currentUser?.username || 'Unknown Hunter',
        timestamp: Date.now(),
        location: details?.location || 'Unknown Location',
        notes: details?.notes
      });
      
      await get().fetchTeamStats();
      await get().fetchBattleLog();
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  fetchTeamStats: async () => {
    try {
      const stats = await getTeamStats();
      set({ teamStats: stats });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },

  fetchBattleLog: async () => {
    try {
      const log = await getRecentBattleLog();
      set({ battleLog: log });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
}));
