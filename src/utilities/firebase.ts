import {
  initializeApp,
  cert,
  getApps,
  ServiceAccount,
} from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";

// Firebase configuration from environment variables
const firebaseConfig: ServiceAccount = {
  projectId: process.env.FIREBASE_PROJECT_ID || "",
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n") || "",
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL || "",
};

// Initialize Firebase Admin only if not already initialized
let app;
if (getApps().length === 0) {
  app = initializeApp({
    credential: cert(firebaseConfig),
    projectId: process.env.FIREBASE_PROJECT_ID || "",
  });
} else {
  app = getApps()[0];
}

// Initialize Firestore
export const db = getFirestore(app, process.env.FIREBASE_DATABASE_ID || "");

// Utility function to validate Firebase configuration
export const validateFirebaseConfig = (): boolean => {
  const requiredVars = [
    "FIREBASE_PROJECT_ID",
    "FIREBASE_PRIVATE_KEY",
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_DATABASE_ID",
  ];

  const missingVars = requiredVars.filter((varName) => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error("❌ Missing Firebase environment variables:", missingVars);
    return false;
  }

  return true;
};

export default app;
