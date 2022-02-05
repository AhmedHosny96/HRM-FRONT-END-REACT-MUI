// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAcRWtavMPVwvVeT6gik6xiHiHRgZ5f_zs",
  authDomain: "rays-hrm-fullstack.firebaseapp.com",
  projectId: "rays-hrm-fullstack",
  storageBucket: "rays-hrm-fullstack.appspot.com",
  messagingSenderId: "516883403508",
  appId: "1:516883403508:web:64cd78d5619d00c608c4a1",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
