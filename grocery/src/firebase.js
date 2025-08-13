import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBbGRzJmd67DhT-38oCCg41N9QiNNV_K7Q",
  authDomain: "create-project-6ef90.firebaseapp.com",
  projectId: "create-project-6ef90",
  storageBucket: "create-project-6ef90.firebasestorage.app",
  messagingSenderId: "629043844619",
  appId: "1:629043844619:web:eadb7f951c4c710476990e",
  measurementId: "G-2KC49XBG9B"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);