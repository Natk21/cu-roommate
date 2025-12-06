// src/firebase/config.ts - REVERT TO THIS
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// NO STORAGE IMPORT

const firebaseConfig = {
  apiKey: "AIzaSyCC6KojCnC6siphX2agJsXsI1_JnLDwmDU",
  authDomain: "cu-roomate.firebaseapp.com",
  projectId: "cu-roomate",
  storageBucket: "cu-roomate.firebasestorage.app",
  messagingSenderId: "844452971022",
  appId: "1:844452971022:web:0c39ad7c83eb2ed1e1f25f",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Auth
export const auth = getAuth(app);

// NO STORAGE EXPORT

export default app;