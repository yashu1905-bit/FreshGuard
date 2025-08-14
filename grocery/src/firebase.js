import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "Your api key",
  authDomain: "create-project-6ef90.firebaseapp.com",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "YOUR API ID",
  measurementId: ""
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
