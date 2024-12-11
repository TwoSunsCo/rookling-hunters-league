import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, setPersistence, browserLocalPersistence, connectAuthEmulator } from 'firebase/auth';

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
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Initialize Auth
const auth = getAuth(app);

// Set persistence to local
(async () => {
  try {
    await setPersistence(auth, browserLocalPersistence);
  } catch (error) {
    console.error('Auth persistence error:', error);
  }
})();

export { app, db, auth };