import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  sendPasswordResetEmail, 
  signOut 
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCHzLQKX4aECf1U3abYyNXCGSTQK8c-Gm4",
  authDomain: "birdgrow-92ddc.firebaseapp.com",
  projectId: "birdgrow-92ddc",
  storageBucket: "birdgrow-92ddc.firebasestorage.app",
  messagingSenderId: "590964948278",
  appId: "1:590964948278:web:46d247fd76354eb8a1c797",
  measurementId: "G-9WZV059ZX7"
};
    
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export { signInWithEmailAndPassword, sendPasswordResetEmail, signOut };