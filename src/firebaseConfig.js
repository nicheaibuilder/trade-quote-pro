import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ⚠️ IMPORTANT: Replace these with your actual keys from the Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyC1RsWA6zbRGLUOk7tgNAZusY-bH6Y-fs8",
  authDomain: "tradequote-pro-app.firebaseapp.com",
  projectId: "tradequote-pro-app",
  storageBucket: "tradequote-pro-app.firebasestorage.app",
  messagingSenderId: "410108716114",
  appId: "1:410108716114:web:6a6161ad117f967bed6b8b",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);