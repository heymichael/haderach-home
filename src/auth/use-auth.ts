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
  APP_CATALOG,
  ADMIN_CATALOG,
  getAccessibleApps,
  getAccessibleAdminApps,
  hasAppAccess,
  getReturnTo,
  returnToAppId,
  type AppEntry,
} from "./roles.ts"

export interface UserProfile {
  displayName?: string
  photoURL?: string
}

export type AuthState =
  | { status: "loading" }
  | { status: "init-error"; message: string }
  | { status: "signed-out" }
  | { status: "authorized"; user: User; apps: AppEntry[]; adminApps: AppEntry[]; profile: UserProfile }
  | { status: "no-access"; user: User; profile: UserProfile }

function shouldBypassAuth(): boolean {
  if (import.meta.env.VITE_AUTH_BYPASS === "true") return true
  const params = new URLSearchParams(window.location.search)
  return params.get("authBypass") === "1"
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

interface UserDoc {
  roles: string[]
  firstName: string
  lastName: string
}

async function fetchUserDoc(
  db: import("firebase/firestore").Firestore,
  email: string,
): Promise<UserDoc> {
  const empty: UserDoc = { roles: [], firstName: "", lastName: "" }
  try {
    const snap = await getDoc(doc(db, "users", normalizeEmail(email)))
    if (!snap.exists()) return empty
    const data = snap.data()
    return {
      roles: Array.isArray(data.roles) ? data.roles : [],
      firstName: typeof data.first_name === "string" ? data.first_name : "",
      lastName: typeof data.last_name === "string" ? data.last_name : "",
    }
  } catch {
    return empty
  }
}

function buildDisplayName(firstName: string, lastName: string): string | undefined {
  const full = [firstName, lastName].filter(Boolean).join(" ")
  return full || undefined
}

export function useAuth() {
  const [state, setState] = useState<AuthState>(() => {
    if (shouldBypassAuth()) {
      return {
        status: "authorized",
        user: { email: "dev@haderach.ai" } as User,
        apps: APP_CATALOG,
        adminApps: ADMIN_CATALOG,
        profile: { displayName: "Dev User" },
      }
    }
    return { status: "loading" }
  })
  const [firebaseReady, setFirebaseReady] = useState<{
    auth: import("firebase/auth").Auth
    db: import("firebase/firestore").Firestore
  } | null>(null)

  useEffect(() => {
    if (shouldBypassAuth()) return

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
      const userDoc = await fetchUserDoc(db, user.email ?? "")
      const profile: UserProfile = {
        displayName: buildDisplayName(userDoc.firstName, userDoc.lastName),
        photoURL: user.photoURL ?? undefined,
      }
      const accessible = getAccessibleApps(userDoc.roles)

      if (accessible.length === 0) {
        setState({ status: "no-access", user, profile })
        return
      }

      const returnTo = getReturnTo()
      if (returnTo) {
        const targetAppId = returnToAppId(returnTo)
        if (targetAppId && hasAppAccess(userDoc.roles, targetAppId)) {
          window.location.replace(returnTo)
          return
        }
      }

      const adminApps = getAccessibleAdminApps(userDoc.roles)
      setState({ status: "authorized", user, apps: accessible, adminApps, profile })
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
