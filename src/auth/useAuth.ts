import { useState, useEffect } from "react"
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import { initFirebase, googleProvider } from "./firebase.ts"
import {
  getAccessibleApps,
  hasAppAccess,
  getReturnTo,
  returnToAppId,
  type AppEntry,
} from "./roles.ts"

export type AuthState =
  | { status: "loading" }
  | { status: "init-error"; message: string }
  | { status: "signed-out" }
  | { status: "authorized"; user: User; apps: AppEntry[] }
  | { status: "no-access"; user: User }

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

async function fetchUserRoles(
  db: import("firebase/firestore").Firestore,
  email: string
): Promise<string[]> {
  try {
    const snap = await getDoc(doc(db, "users", normalizeEmail(email)))
    if (!snap.exists()) return []
    const data = snap.data()
    return Array.isArray(data.roles) ? data.roles : []
  } catch {
    return []
  }
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({ status: "loading" })
  const [firebaseReady, setFirebaseReady] = useState<{
    auth: import("firebase/auth").Auth
    db: import("firebase/firestore").Firestore
  } | null>(null)

  useEffect(() => {
    let cancelled = false

    initFirebase()
      .then((fb) => {
        if (!cancelled) setFirebaseReady(fb)
      })
      .catch(() => {
        if (!cancelled)
          setState({
            status: "init-error",
            message:
              "Platform configuration unavailable. Please try again later.",
          })
      })

    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (!firebaseReady) return

    const { auth, db } = firebaseReady

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setState({ status: "signed-out" })
        return
      }

      setState({ status: "loading" })
      const roles = await fetchUserRoles(db, user.email ?? "")
      const accessible = getAccessibleApps(roles)

      if (accessible.length === 0) {
        setState({ status: "no-access", user })
        return
      }

      const returnTo = getReturnTo()
      if (returnTo) {
        const targetAppId = returnToAppId(returnTo)
        if (targetAppId && hasAppAccess(roles, targetAppId)) {
          window.location.replace(returnTo)
          return
        }
      }

      setState({ status: "authorized", user, apps: accessible })
    })

    return unsubscribe
  }, [firebaseReady])

  async function handleSignIn() {
    if (!firebaseReady) return
    try {
      await signInWithPopup(firebaseReady.auth, googleProvider)
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Sign-in failed."
      setState({ status: "init-error", message })
    }
  }

  async function handleSignOut() {
    if (!firebaseReady) return
    await signOut(firebaseReady.auth)
  }

  return { state, handleSignIn, handleSignOut }
}
