// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBq_t4SRULy9nYIuO6CHYAHu3ajVrGmfM0",
    authDomain: "meet-record-b7047.firebaseapp.com",
    projectId: "meet-record-b7047",
    storageBucket: "meet-record-b7047.appspot.com",
    messagingSenderId: "1072356540390",
    appId: "1:1072356540390:web:96d94e93a483ec939b2027"
};



const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider()
export const db = getFirestore(app);
