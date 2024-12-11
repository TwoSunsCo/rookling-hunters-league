import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  AuthError,
  onAuthStateChanged
} from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { createUser, deleteUserData } from './users';
import type { Team } from '../../types';
import { FirebaseError } from 'firebase/app';

export class AuthError extends Error {
  constructor(
    message: string,
    public readonly code: string,
    public readonly originalError?: FirebaseError
  ) {
    super(message);
    this.name = 'AuthError';
  }
}

export class AuthService {
  private static async validateUser(user: FirebaseUser): Promise<void> {
    try {
      await user.getIdToken(true);
    } catch (error) {
      throw new AuthError(
        'Session expired. Please sign in again.',
        'auth/invalid-token',
        error as FirebaseError
      );
    }
  }

  static async signIn(email: string, password: string): Promise<FirebaseUser> {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      await this.validateUser(user);
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
        // Cleanup: If we created the auth user but failed to create the user document
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
              await this.validateUser(user);
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

  static onAuthStateChange(callback: (user: FirebaseUser | null) => void) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          await this.validateUser(user);
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
        throw new AuthError('Email already registered', error.code, error);
      
      case 'auth/invalid-email':
        throw new AuthError('Invalid email address', error.code, error);
      
      case 'auth/operation-not-allowed':
        throw new AuthError('Account creation is currently disabled', error.code, error);
      
      case 'auth/weak-password':
        throw new AuthError('Password must be at least 6 characters', error.code, error);
      
      case 'auth/user-not-found':
      case 'auth/wrong-password':
        // Combined error to avoid revealing which is incorrect
        throw new AuthError('Invalid email or password', 'auth/invalid-credentials', error);
      
      case 'auth/too-many-requests':
        throw new AuthError(
          'Too many attempts. Please try again later',
          error.code,
          error
        );
      
      case 'auth/network-request-failed':
        throw new AuthError(
          'Network error. Please check your connection.',
          error.code,
          error
        );
      
      case 'auth/requires-recent-login':
        throw new AuthError(
          'Please sign in again to continue',
          error.code,
          error
        );
      
      default:
        throw new AuthError(baseErrorMessage, error.code || 'auth/unknown', error);
    }
  }
}