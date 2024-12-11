import { 
  collection, 
  query, 
  getDocs, 
  where,
  updateDoc,
  doc,
  increment
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Team, TeamStats } from '../types';

export const getTeamStats = async (): Promise<TeamStats[]> => {
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
        totalKills += user.kills;
        if (user.kills > topKills) {
          topKills = user.kills;
          topKiller = user.username;
        }
      });

      return {
        team,
        totalKills,
        memberCount: querySnapshot.size,
        topKiller,
      };
    })
  );

  return stats;
};