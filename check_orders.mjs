import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs } from "firebase/firestore";

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

async function checkOrders() {
  console.log("Querying Firestore 'orders' collection...");
  try {
    const q = collection(db, "orders");
    const snap = await getDocs(q);
    console.log(`Total orders found in Firestore: ${snap.size}`);
    snap.docs.forEach((doc) => {
      console.log("\n=========================================");
      console.log("Doc ID:", doc.id);
      console.log("Data:", JSON.stringify(doc.data(), null, 2));
    });
    process.exit(0);
  } catch (err) {
    console.error("Error fetching orders:", err);
    process.exit(1);
  }
}

checkOrders();
