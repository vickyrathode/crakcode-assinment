import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyAlgofUY7fHTkhk5ZxizZBMvbUZSfDeejs",
  authDomain: "rajat-6928e.firebaseapp.com",
  projectId: "rajat-6928e",
  storageBucket: "rajat-6928e.appspot.com",
  messagingSenderId: "596757141594",
  appId: "1:596757141594:web:c639d562a1d19e150c6063",
  measurementId: "G-70232Z2454"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);