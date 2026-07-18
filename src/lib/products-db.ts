import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  setDoc,
  writeBatch,
} from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { db, storage } from "./firebase";
import { PRODUCTS } from "@/data/products";
import type { Product } from "@/types";

const COLLECTION = "products";

/** Firestore doc id for a product (ids are numeric in the catalog). */
const docId = (id: number) => String(id);

/**
 * Subscribe to the live products collection.
 * Calls `onData` with the current list on every change.
 * Returns an unsubscribe function.
 */
export function subscribeToProducts(
  onData: (products: Product[]) => void,
  onError?: (err: Error) => void,
): () => void {
  return onSnapshot(
    collection(db, COLLECTION),
    (snap) => {
      const list = snap.docs.map((d) => d.data() as Product);
      onData(list);
    },
    (err) => onError?.(err),
  );
}

export async function createOrUpdateProduct(product: Product): Promise<void> {
  await setDoc(doc(db, COLLECTION, docId(product.id)), product);
}

export async function deleteProduct(id: number): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, docId(id)));
}

/** Upload an image file to Cloudinary or Firebase Storage based on configuration. */
export async function uploadProductImage(
  file: File,
  slug: string,
): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (cloudName && uploadPreset) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", `products/${slug}`);

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error?.message ?? "Cloudinary upload failed.");
    }

    const data = await res.json();
    return data.secure_url;
  }

  // Fallback to Firebase Storage
  const safeSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-") || "product";
  const path = `products/${safeSlug}/${Date.now()}-${file.name}`;
  const storageRef = ref(storage, path);
  
  const timeoutPromise = new Promise<never>((_, reject) =>
    setTimeout(
      () =>
        reject(
          new Error(
            "Upload timed out. Ensure Firebase Storage is initialized in your Firebase Console, and the bucket name in .env matches."
          )
        ),
      15000
    )
  );

  await Promise.race([
    uploadBytes(storageRef, file),
    timeoutPromise
  ]);
  
  return getDownloadURL(storageRef);
}

/** Best-effort removal of a previously uploaded Storage image by its URL. */
export async function deleteProductImageByUrl(url: string): Promise<void> {
  if (!url.includes("firebasestorage.googleapis.com")) return;
  try {
    await deleteObject(ref(storage, url));
  } catch {
    // Ignore — image may already be gone or not owned by Storage.
  }
}

/**
 * One-time import of the bundled static catalog into Firestore.
 * Safe to run when the collection is empty; skips if products already exist.
 */
export async function seedProductsIfEmpty(): Promise<number> {
  const existing = await getDocs(collection(db, COLLECTION));
  if (!existing.empty) return 0;
  const batch = writeBatch(db);
  for (const product of PRODUCTS) {
    batch.set(doc(db, COLLECTION, docId(product.id)), product);
  }
  await batch.commit();
  return PRODUCTS.length;
}

/**
 * Bulk import an array of products to Firestore, splitting into 500-doc write batches.
 */
export async function importProductsToDb(products: Product[]): Promise<void> {
  const chunks: Product[][] = [];
  for (let i = 0; i < products.length; i += 500) {
    chunks.push(products.slice(i, i + 500));
  }
  for (const chunk of chunks) {
    const batch = writeBatch(db);
    for (const product of chunk) {
      batch.set(doc(db, COLLECTION, docId(product.id)), product);
    }
    await batch.commit();
  }
}

