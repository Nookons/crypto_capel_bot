// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA9pmdiqwOblPOMWZCPQq_Gldaaa_yv_Vo",
    authDomain: "crypto-capel.firebaseapp.com",
    projectId: "crypto-capel",
    storageBucket: "crypto-capel.appspot.com",
    messagingSenderId: "135705563162",
    appId: "1:135705563162:web:3d95969f71cde283e581a3",
    measurementId: "G-1KHC3P7MFD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);