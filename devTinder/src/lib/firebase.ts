// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC6lzSVSQBgUqjsgmh23kTzIqo8T_Ii2Ak",
  authDomain: "devtinder-816.firebaseapp.com",
  projectId: "devtinder-816",
  storageBucket: "devtinder-816.firebasestorage.app",
  messagingSenderId: "807302046852",
  appId: "1:807302046852:web:ca4e62e1633d3ed897ced1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export default app;