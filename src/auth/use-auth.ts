import { useState, useEffect } from "react"
import {
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth"
import { initFirebase, googleProvider } from "./firebase.ts"
import { buildDisplayName, fetchUserDoc } from "@haderach/shared-ui"
import {
  APP_CATALOG,
  getAccessibleApps,
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
  | { status: "authorized"; user: User; apps: AppEntry[]; roles: string[]; profile: UserProfile }
  | { status: "no-access"; user: User; profile: UserProfile }

function shouldBypassAuth(): boolean {
  if (import.meta.env.VITE_AUTH_BYPASS === "true") return true
  const params = new URLSearchParams(window.location.search)
  return params.get("authBypass") === "1"
}

export function useAuth() {
  const [state, setState] = useState<AuthState>(() => {
    if (shouldBypassAuth()) {
      return {
        status: "authorized",
        user: { email: "dev@haderach.ai" } as User,
        apps: APP_CATALOG,
        roles: ["admin", "finance_admin", "investor", "home"],
        profile: { displayName: "Dev User" },
      }
    }
    return { status: "loading" }
  })
  const [firebaseAuth, setFirebaseAuth] = useState<
    import("firebase/auth").Auth | null
  >(null)

  useEffect(() => {
    if (shouldBypassAuth()) return

    let cancelled = false

    initFirebase()
      .then((fb) => {
        if (!cancelled) setFirebaseAuth(fb.auth)
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
    if (!firebaseAuth) return

    const unsubscribe = onAuthStateChanged(firebaseAuth, async (user) => {
      if (!user) {
        setState({ status: "signed-out" })
        return
      }

      setState({ status: "loading" })
      const userDoc = await fetchUserDoc(() => user.getIdToken())
      const profile: UserProfile = {
        displayName: buildDisplayName(userDoc.firstName, userDoc.lastName),
        photoURL: user.photoURL ?? undefined,
      }
      const accessible = getAccessibleApps(userDoc.roles)
      const HOME_ROLES = ["home", "investor"]
      const hasHomeAccess = userDoc.roles.some((r) => HOME_ROLES.includes(r))

      if (accessible.length === 0 && !hasHomeAccess) {
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

      setState({ status: "authorized", user, apps: accessible, roles: userDoc.roles, profile })
    })

    return unsubscribe
  }, [firebaseAuth])

  async function handleSignIn() {
    if (!firebaseAuth) return
    try {
      await signInWithPopup(firebaseAuth, googleProvider)
    } catch (err) {
      if (
        err != null &&
        typeof err === "object" &&
        "code" in err &&
        err.code === "auth/popup-closed-by-user"
      ) {
        return
      }
      const message =
        err instanceof Error ? err.message : "Sign-in failed."
      setState({ status: "init-error", message })
    }
  }

  async function handleSignOut() {
    if (!firebaseAuth) return
    await signOut(firebaseAuth)
  }

  return { state, handleSignIn, handleSignOut }
}
