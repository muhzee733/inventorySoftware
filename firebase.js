// firebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyC9N2NPneTsrTMiTveU8-4SeBbnz8Sn_Ho",
    authDomain: "inventry-e7a71.firebaseapp.com",
    projectId: "inventry-e7a71",
    storageBucket: "inventry-e7a71.appspot.com",
    messagingSenderId: "237051049985",
    appId: "1:237051049985:web:8f785d746430fe070f2800"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { app, db, auth };
