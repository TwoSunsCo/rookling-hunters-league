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