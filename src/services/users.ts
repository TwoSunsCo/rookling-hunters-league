import { 
  doc, 
  getDoc, 
  setDoc,
  updateDoc,
  increment,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { User, Team } from '../types';

export const createUser = async (
  uid: string, 
  data: { username: string; team: Team }
): Promise<User> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userData: User = {
      id: uid,
      username: data.username,
      team: data.team,
      kills: 0,
      createdAt: serverTimestamp(),
    };
    
    await setDoc(userRef, userData);
    return userData;
  } catch (error) {
    console.error('Error creating user:', error);
    throw new Error('Failed to create user profile');
  }
};

export const getUser = async (uid: string): Promise<User | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    return userSnap.exists() ? { ...userSnap.data(), id: userSnap.id } as User : null;
  } catch (error) {
    console.error('Error fetching user:', error);
    throw new Error('Failed to fetch user profile');
  }
};

export const incrementKills = async (uid: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      kills: increment(1),
      lastKillAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error incrementing kills:', error);
    throw new Error('Failed to update kill count');
  }
};