import { initializeApp, type FirebaseApp } from "firebase/app"
import {
  getAuth,
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
  type Auth,
} from "firebase/auth"
import { getFirestore, type Firestore } from "firebase/firestore"

let app: FirebaseApp | null = null
let auth: Auth | null = null
let db: Firestore | null = null

export async function initFirebase(): Promise<{ auth: Auth; db: Firestore }> {
  if (auth && db) return { auth, db }

  const resp = await fetch("/__/firebase/init.json")
  if (!resp.ok) throw new Error("Failed to load Firebase config")
  const config = await resp.json()

  app = initializeApp(config)
  auth = getAuth(app)
  db = getFirestore(app)

  await setPersistence(auth, browserLocalPersistence).catch(() => {})

  return { auth, db }
}

export function getFirebaseAuth(): Auth {
  if (!auth) throw new Error("Firebase not initialized")
  return auth
}

export function getFirebaseDb(): Firestore {
  if (!db) throw new Error("Firebase not initialized")
  return db
}

export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: "select_account" })
