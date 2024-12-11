import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User as FirebaseUser,
  AuthError
} from 'firebase/auth';
import { auth } from '../../lib/firebase';
import { createUser } from './users';
import type { Team } from '../../types';

export class AuthService {
  static async signIn(email: string, password: string) {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      return user;
    } catch (error) {
      this.handleAuthError(error as AuthError);
    }
  }

  static async signUp(email: string, password: string, username: string, team: Team) {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      await createUser(user.uid, { username, team });
      return user;
    } catch (error) {
      this.handleAuthError(error as AuthError);
    }
  }

  static async signOut() {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out. Please try again.');
    }
  }

  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  private static handleAuthError(error: AuthError) {
    console.error('Auth error:', error);
    
    switch (error.code) {
      case 'auth/email-already-in-use':
        throw new Error('Email already registered');
      case 'auth/invalid-email':
        throw new Error('Invalid email address');
      case 'auth/operation-not-allowed':
        throw new Error('Account creation is currently disabled');
      case 'auth/weak-password':
        throw new Error('Password must be at least 6 characters');
      case 'auth/user-not-found':
        throw new Error('No account found with this email');
      case 'auth/wrong-password':
        throw new Error('Incorrect password');
      case 'auth/too-many-requests':
        throw new Error('Too many attempts. Please try again later');
      default:
        throw new Error('Authentication failed. Please try again.');
    }
  }
}