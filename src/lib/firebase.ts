import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  GoogleAuthProvider, 
  signInWithPopup,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import { 
  initializeFirestore, 
  persistentLocalCache, 
  persistentMultipleTabManager,
  getFirestore
} from 'firebase/firestore';

// Load credentials from firebase-applet-config.json or use fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Use a persistent local cache for offline scenarios and target the correct database instance
let db;
const dbId = import.meta.env.VITE_FIRESTORE_DATABASE_ID || "(default)";
try {
  db = initializeFirestore(app, {
    localCache: persistentLocalCache({
      tabManager: persistentMultipleTabManager()
    })
  }, dbId);
} catch (err) {
  console.warn("Persistent cache failed, falling back to default/memory cache:", err);
  // Fallback if TabManager/IndexedDB is restricted in cross-origin preview iframe
  try {
    db = initializeFirestore(app, {}, dbId);
  } catch (innerErr) {
    console.error("Critical Firestore init failure:", innerErr);
    db = getFirestore(app, dbId);
  }
}

const googleProvider = new GoogleAuthProvider();

export { 
  app, 
  auth, 
  db, 
  googleProvider,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged
};
export type { User };
