import { initializeApp } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.20.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA9t1WN6nZ-ENqXZFGXYMu85j0c8qXkMFw",
  authDomain: "gallery-4c7a5.firebaseapp.com",
  projectId: "gallery-4c7a5",
  storageBucket: "gallery-4c7a5.appspot.com",
  messagingSenderId: "492707125714",
  appId: "1:492707125714:web:ce5deb0e6b159b7f8c100b"
};
// Ініціалізація Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
