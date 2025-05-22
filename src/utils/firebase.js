// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxjSL863MzQEmZmilkTOT4quWxS5Dw2p4",
  authDomain: "bookeasy-5c7ac.firebaseapp.com",
  projectId: "bookeasy-5c7ac",
  storageBucket: "bookeasy-5c7ac.firebasestorage.app",
  messagingSenderId: "288921778301",
  appId: "1:288921778301:web:c3c64d025c7a0619519914",
  measurementId: "G-DNHFTF1PNH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);