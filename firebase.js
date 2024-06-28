const { initializeApp }     = require("firebase/app");
const { getFirestore }      = require("firebase/firestore");

const firebaseConfig = {
    apiKey: "AIzaSyA9pmdiqwOblPOMWZCPQq_Gldaaa_yv_Vo",
    authDomain: "crypto-capel.firebaseapp.com",
    projectId: "crypto-capel",
    storageBucket: "crypto-capel.appspot.com",
    messagingSenderId: "135705563162",
    appId: "1:135705563162:web:3d95969f71cde283e581a3",
    measurementId: "G-1KHC3P7MFD"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = db;