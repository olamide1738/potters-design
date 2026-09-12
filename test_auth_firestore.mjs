import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD5Iy6qfaheaXMKO64jqyhGqXYTeyj2rP0",
  authDomain: "pottersdesign-f0ab8.firebaseapp.com",
  projectId: "pottersdesign-f0ab8",
  storageBucket: "pottersdesign-f0ab8.firebasestorage.app",
  messagingSenderId: "220659032301",
  appId: "1:220659032301:web:e5309f0106fceb7df9ece4",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function run() {
  console.log("Attempting sign-in with admin credentials...");
  let user;
  try {
    const cred = await signInWithEmailAndPassword(auth, "pottersdesigning@gmail.com", "PottersDesign2024!");
    user = cred.user;
    console.log("Signed in successfully as:", user.email);
  } catch (err) {
    console.log("Sign-in failed with error code:", err.code);
    try {
      console.log("Attempting sign in with default admin...");
      const cred = await signInWithEmailAndPassword(auth, "admin@pottersdesign.com", "admin123456");
      user = cred.user;
      console.log("Signed in successfully as:", user.email);
    } catch (err2) {
      console.log("Second sign in failed:", err2.code);
    }
  }

  if (auth.currentUser) {
    console.log("Authenticated User UID:", auth.currentUser.uid);
    console.log("Reading orders collection...");
    const snap = await getDocs(collection(db, "orders"));
    console.log("Total orders in Firestore:", snap.size);
    snap.docs.forEach(d => console.log(d.id, d.data()));
  }
}

run();
