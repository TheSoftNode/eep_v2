import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";

const firebaseConfig = {
    apiKey: "AIzaSyBFA2wb1p3bNkbJJP02TF1WthEBIneq-04",
    authDomain: "enterprise-edu.firebaseapp.com",
    projectId: "enterprise-edu",
    storageBucket: "enterprise-edu.firebasestorage.app",
    messagingSenderId: "320559156285",
    appId: "1:320559156285:web:3453cb5b7ba3c66b89ee54",
    measurementId: "G-3K7YRFE9X7"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const messaging = getMessaging(app);

export { app, firestore, messaging };