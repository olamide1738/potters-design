import {
  collection,
  doc,
  onSnapshot,
  query,
  orderBy,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "./firebase";
import type { Order, OrderStatus, OrderProductionStatus } from "@/types";
import type { OrderPayload } from "./orders";

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

/**
 * Update an order's production pipeline status in Firestore.
 */
export async function updateOrderProductionStatus(
  orderId: string,
  productionStatus: OrderProductionStatus,
): Promise<void> {
  const ref = doc(db, COLLECTION, orderId);
  await updateDoc(ref, { productionStatus });
}

/**
 * Strips undefined properties recursively so Firestore DocumentReference.set() never throws.
 */
function sanitizeForFirestore<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Creates an order directly in Firestore from the client.
 * Guarantees the order is reflected in the database immediately with zero CORS/server dependencies.
 */
export async function createOrderInFirestore(
  orderId: string,
  orderData: OrderPayload,
  status: OrderStatus = "pending",
): Promise<void> {
  const ref = doc(db, COLLECTION, orderId);
  const cleanData = sanitizeForFirestore(orderData);
  await setDoc(ref, {
    ...cleanData,
    id: orderId,
    reference: orderData.paymentMethod === "bank" ? `bank-${orderId}` : orderId,
    status,
    createdAt: serverTimestamp(),
    paidAt: status === "paid" ? serverTimestamp() : null,
  });
}

/**
 * Marks an existing order as paid in Firestore (e.g. after Paystack verification).
 */
export async function markOrderPaidInFirestore(
  orderId: string,
  reference?: string,
  channel?: string,
): Promise<void> {
  const ref = doc(db, COLLECTION, orderId);
  await updateDoc(ref, {
    status: "paid",
    paidAt: serverTimestamp(),
    ...(reference ? { reference } : {}),
    ...(channel ? { paystackChannel: channel } : {}),
  });
}
