import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, enableIndexedDbPersistence } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAfGI8P4Wqv1kmbhQzauq1Nv_Zu6hZ4tUk",
  authDomain: "nailtechsalon-e8617.firebaseapp.com",
  projectId: "nailtechsalon-e8617",
  storageBucket: "nailtechsalon-e8617.firebasestorage.app",
  messagingSenderId: "272237899220",
  appId: "1:272237899220:web:26d0048fd85b599516fa41",
  measurementId: "G-L9DZV0GTD4",
};

// Initialize Firebase only if it hasn't been initialized already
let app;
try {
  app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
  throw error;
}

export const auth = getAuth(app);
export const db = getFirestore(app);

// Only initialize analytics on the client side
export const analytics =
  typeof window !== "undefined" ? getAnalytics(app) : null;

// Enable offline persistence
if (typeof window !== "undefined") {
  enableIndexedDbPersistence(db).catch((error) => {
    if (error.code === "failed-precondition") {
      console.warn("Multiple tabs open, persistence disabled");
    } else if (error.code === "unimplemented") {
      console.warn("Browser does not support persistence");
    }
  });
}

export default app;
