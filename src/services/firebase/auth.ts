import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { createUser } from './users';
import type { Team } from '../../types';
import { FirebaseError } from 'firebase/app';
import { AuthError } from '../errors/AuthError';
import { validateUser } from './validators';

export class AuthService {
  static async signIn(email: string, password: string): Promise<FirebaseUser> {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await validateUser(user);
      return user;
    } catch (error) {
      throw this.handleAuthError(error as FirebaseError);
    }
  }

  static async signUp(
    email: string, 
    password: string, 
    username: string, 
    team: Team
  ): Promise<FirebaseUser> {
    let authUser: FirebaseUser | null = null;
    
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      authUser = user;
      
      await createUser(user.uid, { 
        username, 
        team,
        email,
        createdAt: new Date().toISOString()
      });
      
      return user;
    } catch (error) {
      if (authUser) {
        try {
          await authUser.delete();
        } catch (deleteError) {
          console.error('Failed to cleanup auth user:', deleteError);
        }
      }
      throw this.handleAuthError(error as FirebaseError);
    }
  }

  static async signOut(): Promise<void> {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      throw new AuthError(
        'Failed to sign out. Please try again.',
        'auth/sign-out-failed',
        error as FirebaseError
      );
    }
  }

  static async getCurrentUser(): Promise<FirebaseUser | null> {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        async (user) => {
          unsubscribe();
          if (user) {
            try {
              await validateUser(user);
              resolve(user);
            } catch (error) {
              resolve(null);
            }
          } else {
            resolve(null);
          }
        },
        reject
      );
    });
  }

  static onAuthStateChange(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await validateUser(user);
          callback(user);
        } catch (error) {
          callback(null);
        }
      } else {
        callback(null);
      }
    });
  }

  private static handleAuthError(error: FirebaseError): never {
    const baseErrorMessage = 'Authentication failed. Please try again.';
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        throw
