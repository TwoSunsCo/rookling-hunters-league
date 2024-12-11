import { 
  collection, 
  query, 
  getDocs, 
  where,
  updateDoc,
  doc,
  increment,
  FirestoreError
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { Team, TeamStats } from '../../types';

export class TeamService {
  static async getStats(): Promise<TeamStats[]> {
    try {
      const usersRef = collection(db, 'users');
      const teams: Team[] = ['red', 'blue', 'green', 'yellow'];
      
      const stats = await Promise.all(
        teams.map(async (team) => {
          const q = query(usersRef, where('team', '==', team));
          const querySnapshot = await getDocs(q);
          
          let totalKills = 0;
          let topKiller = '';
          let topKills = 0;
          
          querySnapshot.forEach((doc) => {
            const user = doc.data();
            totalKills += user.kills || 0;
            if ((user.kills || 0) > topKills) {
              topKills = user.kills;
              topKiller = user.username;
            }
          });

          return {
            team,
            totalKills,
            memberCount: querySnapshot.size,
            topKiller: topKiller || 'No Champion Yet',
          };
        })
      );

      return stats;
    } catch (error) {
      console.error('Error fetching team stats:', error);
      this.handleFirestoreError(error as FirestoreError);
      return [];
    }
  }

  private static handleFirestoreError(error: FirestoreError) {
    console.error('Firestore error:', error);
    throw new Error('Failed to fetch team statistics. Please try again.');
  }
}