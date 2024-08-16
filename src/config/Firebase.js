import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyD7PRg1qhuRP0CrtfOj-puIjfb_HmLn4tg",
  authDomain: "beliverz-prod.firebaseapp.com",
  projectId: "beliverz-prod",
  storageBucket: "beliverz-prod.appspot.com",
  messagingSenderId: "917347137280",
  appId: "1:917347137280:web:1989f51e45f86a6e52e5e5"
};

export const app = initializeApp(firebaseConfig);