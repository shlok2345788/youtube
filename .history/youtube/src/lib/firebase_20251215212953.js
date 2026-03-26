// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import getAuth} from 'firebase/auth'

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC1Nh5uc6S9HSb9-CCzoIkcumBtzZRGFs4",
  authDomain: "fir-eebb5.firebaseapp.com",
  projectId: "fir-eebb5",
  storageBucket: "fir-eebb5.firebasestorage.app",
  messagingSenderId: "814282358774",
  appId: "1:814282358774:web:a5f90da0ce6189d98f11d7",
  measurementId: "G-P5KKNTXLEH",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { auth, provider };
