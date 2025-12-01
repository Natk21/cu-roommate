// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
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
const auth = getAuth(app);

export { auth };
