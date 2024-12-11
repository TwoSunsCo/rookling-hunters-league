import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, browserLocalPersistence, setPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCCSQfePNTrkp5m32ld5sqvR1KQS_WUaFc",
  authDomain: "rookling-hunter-league.firebaseapp.com",
  projectId: "rookling-hunter-league",
  storageBucket: "rookling-hunter-league.firebasestorage.app",
  messagingSenderId: "1020132589699",
  appId: "1:1020132589699:web:f945ad460d63b06cd8dbb6",
  measurementId: "G-HLLGKLQRQZ"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// Set persistence to local
(async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch (error) {
    console.error('Auth persistence error:', error);
  }
})();