// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC3TP1V6g2-lesBre0kNPrs8ztOwLmWisQ",
  authDomain: "agentic-loan-app.firebaseapp.com",
  projectId: "agentic-loan-app",
  storageBucket: "agentic-loan-app.firebasestorage.app",
  messagingSenderId: "571127749097",
  appId: "1:571127749097:web:08295131fb7494546c5378"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth with AsyncStorage persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});

// Initialize Firebase services
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
