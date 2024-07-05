const { initializeApp } = require('firebase/app');
const { getFirestore } = require('firebase/firestore');
const { getStorage } = require('firebase/storage');

const firebaseConfig = {
    apiKey: "AIzaSyA9pmdiqwOblPOMWZCPQq_Gldaaa_yv_Vo",
    authDomain: "crypto-capel.firebaseapp.com",
    projectId: "crypto-capel",
    storageBucket: "crypto-capel.appspot.com",
    messagingSenderId: "135705563162",
    appId: "1:135705563162:web:3d95969f71cde283e581a3",
    measurementId: "G-1KHC3P7MFD"
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);
const storage = getStorage(firebaseApp);

module.exports = { db, storage };
