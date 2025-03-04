import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAvfTJEjQQAshm3uv9Tv236gD5nQZsSbCU",
  authDomain: "triadoffaith.firebaseapp.com",
  projectId: "triadoffaith",
  storageBucket: "triadoffaith.firebasestorage.app",
  messagingSenderId: "558113874129",
  appId: "1:558113874129:web:2c64a356ea28eaf93e65f0",
  measurementId: "G-ZG5N5DT6MM"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);