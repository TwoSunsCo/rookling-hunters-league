import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  AuthError
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { createUser } from './users';
import type { Team } from '../types';

const handleAuthError = (error: AuthError): never => {
  console.error('Auth error:', error);
  
  const errorMessages: Record<string, string> = {
    'auth/email-already-in-use': 'Email already registered',
    'auth/invalid-email': 'Invalid email address',
    'auth/operation-not-allowed': 'Account creation is currently disabled',
    'auth/weak-password': 'Password must be at least 6 characters',
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/too-many-requests': 'Too many attempts. Please try again later',
    'auth/configuration-not-found': 'Authentication service is temporarily unavailable',
    'default': 'Authentication failed. Please try again.'
  };

  throw new Error(errorMessages[error.code] || errorMessages.default);
};

export const signIn = async (email: string, password: string) => {
  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    handleAuthError(error as AuthError);
  }
};

export const signUp = async (
  email: string, 
  password: string, 
  username: string,
  team: Team
) => {
  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    await createUser(user.uid, { username, team });
    return user;
  } catch (error) {
    handleAuthError(error as AuthError);
  }
};

export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw new Error('Failed to sign out. Please try again.');
  }
};