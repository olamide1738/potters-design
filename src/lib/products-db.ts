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
  try {
    return onSnapshot(
      collection(db, COLLECTION),
      (snap) => {
        const list = snap.docs.map((d) => d.data() as Product);
        onData(list);
      },
      (err) => onError?.(err),
    );
  } catch (err) {
    console.error("Firestore subscribe error:", err);
    onError?.(err as Error);
    return () => {};
  }
}

export async function createOrUpdateProduct(product: Product): Promise<void> {
  await setDoc(doc(db, COLLECTION, docId(product.id)), product);
}

export async function deleteProduct(id: number): Promise<void> {
  await deleteDoc(doc(db, COLLECTION, docId(id)));
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/** Upload an image file to Cloudinary or Firebase Storage based on configuration, falling back gracefully to Data URL. */
export async function uploadProductImage(
  file: File,
  slug: string,
): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  // 1. Try Cloudinary
  if (cloudName && uploadPreset) {
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", uploadPreset);
      formData.append("folder", `products/${slug}`);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.secure_url) return data.secure_url;
      } else {
        console.warn("Cloudinary upload response not OK:", res.statusText);
      }
    } catch (err) {
      console.warn("Cloudinary upload failed, trying fallback:", err);
    }
  }

  // 2. Try Firebase Storage
  try {
    const safeSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-") || "product";
    const path = `products/${safeSlug}/${Date.now()}-${file.name}`;
    const storageRef = ref(storage, path);
    
    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Firebase Storage timeout")), 8000)
    );

    await Promise.race([
      uploadBytes(storageRef, file),
      timeoutPromise
    ]);
    
    const url = await getDownloadURL(storageRef);
    if (url) return url;
  } catch (err) {
    console.warn("Firebase Storage upload failed, using Data URL fallback:", err);
  }

  // 3. Fallback to base64 Data URL so admin uploads work seamlessly offline or without configured cloud storage
  return fileToDataUrl(file);
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

