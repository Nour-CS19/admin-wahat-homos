// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCWxF_a4XoWzyDHY3N2tf3_KrHqoRVb55o",
  authDomain: "cafe-menu-system.firebaseapp.com",
  projectId: "cafe-menu-system",
  storageBucket: "cafe-menu-system.firebasestorage.app",
  messagingSenderId: "673912825667",
  appId: "1:673912825667:web:cab56231bd3f6903dcb1f6",
  measurementId: "G-HKCRK3J0FJ"
};

// ✅ Initialize Firebase first
const app = initializeApp(firebaseConfig);

// ✅ Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);