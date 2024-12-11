// Change this line in src/store/useStore.ts
import { AuthService } from '../services/firebase/auth';
// Then replace the auth method calls:

  login: async (email, password) => {
    try {
      set({ loading: true, error: null });
      const firebaseUser = await AuthService.signIn(email, password);
      if (!firebaseUser) throw new Error('Authentication failed');
      
      const userData = await getUser(firebaseUser.uid);
      if (!userData) throw new Error('User profile not found');
      
      set({ currentUser: userData });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  register: async (email, password, username, team) => {
    try {
      set({ loading: true, error: null });
      const firebaseUser = await AuthService.signUp(email, password, username, team);
      if (!firebaseUser) throw new Error('Registration failed');
      
      const userData = await getUser(firebaseUser.uid);
      if (!userData) throw new Error('User profile not found');
      
      set({ currentUser: userData });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await AuthService.signOut();
      set({ currentUser: null });
    } catch (error: any) {
      set({ error: error.message });
      throw error;
    }
  },
