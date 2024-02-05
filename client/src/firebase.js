// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-f2857.firebaseapp.com",
  projectId: "mern-blog-f2857",
  storageBucket: "mern-blog-f2857.appspot.com",
  messagingSenderId: "738696492015",
  appId: "1:738696492015:web:092a478be43d711930fc1a"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);