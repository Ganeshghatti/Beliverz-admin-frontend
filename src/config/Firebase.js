import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCFUZm5hbzxPup68xvnqUxXAGg5is6LedU",
  authDomain: "beliverz.firebaseapp.com",
  projectId: "beliverz",
  storageBucket: "beliverz.appspot.com",
  messagingSenderId: "497639794654",
  appId: "1:497639794654:web:da06612b1a64d5e3cadf4f"
};

export const app = initializeApp(firebaseConfig);