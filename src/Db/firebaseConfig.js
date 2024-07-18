// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBycibK0xVQZVoPHDtVlgDp4SpAQOfmr1s",
    authDomain: "chat-app-9e7f4.firebaseapp.com",
    projectId: "chat-app-9e7f4",
    storageBucket: "chat-app-9e7f4.appspot.com",
    messagingSenderId: "650088531591",
    appId: "1:650088531591:web:6014d6481bb12a2ba75a22",
    measurementId: "G-VFWHJSXX6C"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app);
