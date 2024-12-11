import { 
  collection,
  addDoc,
  query,
  orderBy,
  limit,
  getDocs,
  serverTimestamp,
  FirestoreError
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { BattleLogEntry } from '../../types';

export class BattleLogService {
  static async addEntry(entry: Omit<BattleLogEntry, 'id'>) {
    try {
      const battleLogRef = collection(db, 'battleLog');
      const docRef = await addDoc(battleLogRef, {
        ...entry,
        timestamp: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding battle log entry:', error);
      this.handleFirestoreError(error as FirestoreError);
    }
  }

  static async getRecent(limitCount = 10): Promise<BattleLogEntry[]> {
    try {
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
    } catch (error) {
      console.error('Error fetching battle log:', error);
      this.handleFirestoreError(error as FirestoreError);
      return [];
    }
  }

  private static handleFirestoreError(error: FirestoreError) {
    console.error('Firestore error:', error);
    throw new Error('Failed to process battle log operation. Please try again.');
  }
}