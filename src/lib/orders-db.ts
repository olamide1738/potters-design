import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Order, OrderStatus } from "@/types";

const COLLECTION = "orders";

/**
 * Subscribe to the live orders collection in Firestore, ordered by creation date descending.
 */
export function subscribeToOrders(
  onData: (orders: Order[]) => void,
  onError?: (err: Error) => void,
): () => void {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snap) => {
      const list = snap.docs.map((d) => {
        const data = d.data();
        return {
          ...data,
          id: d.id,
          // Handle converting Timestamp to Date safely
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
          paidAt: data.paidAt?.toDate ? data.paidAt.toDate() : undefined,
        } as Order;
      });
      onData(list);
    },
    (err) => onError?.(err),
  );
}

/**
 * Update an order's status in Firestore.
 */
export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
): Promise<void> {
  const ref = doc(db, COLLECTION, orderId);
  await updateDoc(ref, { status });
}
