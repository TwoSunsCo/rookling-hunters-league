import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthService } from '../services/firebase/auth';
import type { User as FirebaseUser } from 'firebase/auth';
import type { AuthState, AuthContextType } from '../types/auth';
import { useStore } from '../store/useStore';
import type { Team } from '../types';

const initialAuthState: AuthState = {
  isAuthenticated: false,
  isLoading: true,
  user: null,
  error: null
};

const AuthContext = createContext<AuthContextType>({
  authState: initialAuthState,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {}
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>(initialAuthState);
  const { login, register, logout } = useStore();

  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange(async (user) => {
      setAuthState(prev => ({ ...prev, isLoading: true }));
      
      try {
        if (user) {
          setAuthState({
            isAuthenticated: true,
            isLoading: false,
            user,
            error: null
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            isLoading: false,
            user: null,
            error: null
          });
        }
      } catch (error) {
        setAuthState({
          isAuthenticated: false,
          isLoading: false,
          user: null,
          error: error as Error
        });
      }
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      await login(email, password);
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: error as Error
      }));
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signUp = async (email: string, password: string, username: string, team: Team) => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      await register(email, password, username, team);
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: error as Error
      }));
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const signOut = async () => {
    try {
      setAuthState(prev => ({ ...prev, isLoading: true, error: null }));
      await logout();
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: error as Error
      }));
      throw error;
    } finally {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  };

  return (
    <AuthContext.Provider value={{ authState, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
