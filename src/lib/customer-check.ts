import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

const PAST_CUSTOMER_EMAILS_KEY = "pd-past-customer-emails";

/**
 * Checks if an email address belongs to a NEW customer who has NEVER placed an order before.
 * Verifies against Firestore orders collection as well as local storage order history.
 */
export async function isNewCustomerEmail(email: string): Promise<boolean> {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !normalizedEmail.includes("@")) return false;

  // 1. Check local storage cache of past customer emails
  try {
    const localEmailsRaw = localStorage.getItem(PAST_CUSTOMER_EMAILS_KEY);
    if (localEmailsRaw) {
      const localEmails: string[] = JSON.parse(localEmailsRaw);
      if (localEmails.map((e) => e.toLowerCase()).includes(normalizedEmail)) {
        return false;
      }
    }
  } catch {}

  // 2. Query Firestore orders collection for matching customer email
  try {
    const q = query(
      collection(db, "orders"),
      where("customer.email", "==", normalizedEmail)
    );
    const snap = await getDocs(q);
    if (!snap.empty) {
      // Record exists in Firestore! Cache locally and return false
      recordCustomerEmailLocally(normalizedEmail);
      return false;
    }
  } catch (err) {
    console.warn("Firestore customer check fallback:", err);
  }

  return true;
}

/**
 * Records a customer email in local storage when an order is completed.
 */
export function recordCustomerEmailLocally(email: string): void {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail) return;
  try {
    const localEmailsRaw = localStorage.getItem(PAST_CUSTOMER_EMAILS_KEY);
    const list: string[] = localEmailsRaw ? JSON.parse(localEmailsRaw) : [];
    if (!list.includes(normalizedEmail)) {
      list.push(normalizedEmail);
      localStorage.setItem(PAST_CUSTOMER_EMAILS_KEY, JSON.stringify(list));
    }
  } catch {}
}
