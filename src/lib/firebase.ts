import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyD5Iy6qfaheaXMKO64jqyhGqXYTeyj2rP0",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pottersdesign-f0ab8.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pottersdesign-f0ab8",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "pottersdesign-f0ab8.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "220659032301",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:220659032301:web:e5309f0106fceb7df9ece4",
};

export const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
