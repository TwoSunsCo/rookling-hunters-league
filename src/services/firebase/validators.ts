import { User as FirebaseUser } from 'firebase/auth';
import { AuthError } from '../errors/AuthError';
import { FirebaseError } from 'firebase/app';

export async function validateUser(user: FirebaseUser): Promise<void> {
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
