// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth"

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBIxU0KUbJEErkRFOyaPqf9BxzomuWhnes",
  authDomain: "ts-app-7118b.firebaseapp.com",
  projectId: "ts-app-7118b",
  storageBucket: "ts-app-7118b.appspot.com",
  messagingSenderId: "1082483607349",
  appId: "1:1082483607349:web:b3d6bb1f55bc1f34c2ae7c",
  measurementId: "G-MK5RQ4FRC2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);

export { app, auth };