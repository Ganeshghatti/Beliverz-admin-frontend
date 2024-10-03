import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDgNtK3yWPmBmn-hblwWQqtV9rARC5aSCE",
  authDomain: "beliverz-production.firebaseapp.com",
  projectId: "beliverz-production",
  storageBucket: "beliverz-production.appspot.com",
  messagingSenderId: "855623196375",
  appId: "1:855623196375:web:da26b4385757f54b6c1a92"
};

const app = initializeApp(firebaseConfig);

export { app };