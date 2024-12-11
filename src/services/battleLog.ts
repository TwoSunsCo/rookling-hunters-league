import { 
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { BattleLogEntry } from '../types';

export const addBattleLogEntry = async (entry: Omit<BattleLogEntry, 'id'>) => {
  const battleLogRef = collection(db, 'battleLog');
  const docRef = await addDoc(battleLogRef, {
    ...entry,
    timestamp: Date.now()
  });
  return docRef.id;
};

export const getRecentBattleLog = async (limitCount = 10): Promise<BattleLogEntry[]> => {
  const battleLogRef = collection(db, 'battleLog');
  const q = query(
    battleLogRef,
    orderBy('timestamp', 'desc'),
    limit(limitCount)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as BattleLogEntry[];
};