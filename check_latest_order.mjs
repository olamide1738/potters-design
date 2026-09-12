import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Read from Vercel function logs or check latest order in Firestore
const sa = process.env.FIREBASE_SERVICE_ACCOUNT;
if (sa) {
  if (!getApps().length) {
    initializeApp({ credential: cert(JSON.parse(sa)) });
  }
  const db = getFirestore();
  const snap = await db.collection("orders").orderBy("createdAt", "desc").limit(5).get();
  console.log(`Found ${snap.size} latest orders in Firestore:`);
  snap.docs.forEach(d => console.log(d.id, d.data()));
} else {
  console.log("No FIREBASE_SERVICE_ACCOUNT locally, checking via Vercel endpoint...");
}
