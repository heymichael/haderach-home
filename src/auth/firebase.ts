import { initializeApp, type FirebaseApp } from "firebase/app"
import {
  getAuth,
  GoogleAuthProvider,
  browserLocalPersistence,
  setPersistence,
  type Auth,
} from "firebase/auth"
import { getAuthRuntimeConfig } from "@haderach/shared-ui"

let app: FirebaseApp | null = null
let auth: Auth | null = null

export async function initFirebase(): Promise<{ auth: Auth }> {
  if (auth) return { auth }

  const runtimeConfig = getAuthRuntimeConfig()
  if (!runtimeConfig.firebaseConfig) {
    throw new Error(runtimeConfig.configError ?? "Failed to load Firebase config")
  }
  const config = runtimeConfig.firebaseConfig

  app = initializeApp(config)
  auth = getAuth(app)

  await setPersistence(auth, browserLocalPersistence).catch(() => {})

  return { auth }
}

export function getFirebaseAuth(): Auth {
  if (!auth) throw new Error("Firebase not initialized")
  return auth
}

export const googleProvider = new GoogleAuthProvider()
googleProvider.setCustomParameters({ prompt: "select_account" })
