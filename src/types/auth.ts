import { User as FirebaseUser } from 'firebase/auth';
import { AuthError } from '../services/errors/AuthError';
import { Team } from './index';

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: FirebaseUser | null;
  error: AuthError | null;
}

export interface UserData {
  username: string;
  email: string;
  createdAt: string;
  team: Team;
  uid?: string;
}

export interface AuthContextType {
  authState: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, team: Team) => Promise<void>;
  signOut: () => Promise<void>;
}