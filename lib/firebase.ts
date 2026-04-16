import { initializeApp, getApps } from "firebase/app";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
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

// Enable persistence for offline support
if (typeof window !== "undefined") {
  import("firebase/firestore").then(({ enableNetwork }) => {
    enableNetwork(db).catch((error) => {
      console.error("Failed to enable Firestore network:", error);
    });
  });
}

export default app;
