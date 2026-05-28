// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "",
    authDomain: "lendx-protocol.firebaseapp.com",
    projectId: "lendx-protocol",
    storageBucket: "lendx-protocol.firebasestorage.app",
    messagingSenderId: "536981245916",
    appId: "1:536981245916:web:d9c47ed3d67997859c0919"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
