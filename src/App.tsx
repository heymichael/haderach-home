import { useEffect } from "react"
import { GlobalNav, AppRail, useRailExpanded, Card, CardContent, Button, getAccessibleRailApps } from "@haderach/shared-ui"
import type { NavApp } from "@haderach/shared-ui"
import { useAuth, type AuthState } from "./auth/use-auth.ts"
import { getReturnTo, returnToAppId, APP_CATALOG } from "./auth/roles.ts"
import { SettingsHub } from "./SettingsHub.tsx"
import { Footer } from "./components/Footer.tsx"
import { LegalPage } from "./pages/LegalPage.tsx"
import { QuickBooksIntegrationPage } from "./pages/QuickBooksIntegrationPage.tsx"

function buildNavProps(
  state: AuthState,
  handleSignIn: () => void,
  handleSignOut: () => void,
): React.ComponentProps<typeof GlobalNav> {
  const logo = (
    <img
      className="h-12 w-auto"
      src="/assets/landing/logo.svg"
      alt="Haderach"
    />
  )

  const base = { logo }

  switch (state.status) {
    case "authorized":
      return {
        ...base,
        apps: state.apps as NavApp[],
        userEmail: state.user.email ?? undefined,
        userPhotoURL: state.profile.photoURL,
        userDisplayName: state.profile.displayName,
        onSignOut: handleSignOut,
      }
    case "no-access":
      return {
        ...base,
        userEmail: state.user.email ?? undefined,
        userPhotoURL: state.profile.photoURL,
        userDisplayName: state.profile.displayName,
        onSignOut: handleSignOut,
      }
    case "signed-out":
      return { ...base, onSignIn: handleSignIn }
    default:
      return base
  }
}

function ReturnToPrompt({ onSignIn }: { onSignIn: () => void }) {
  const returnTo = getReturnTo()
  if (!returnTo) return null

  const appId = returnToAppId(returnTo)
  const app = appId ? APP_CATALOG.find((a) => a.id === appId) : null
  const label = app?.label ?? "your app"

  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-surface px-8 py-6 text-center">
      <p className="text-foreground-muted">
        Sign in to continue to <strong className="text-foreground">{label}</strong>
      </p>
      <Button
        variant="outline"
        onClick={onSignIn}
        className="border-border text-foreground hover:border-border-hover hover:bg-surface-hover"
      >
        Sign in with Google
      </Button>
    </div>
  )
}

function isSettingsPath(): boolean {
  const p = window.location.pathname
  return p === "/admin" || p === "/admin/"
}

function getLegalSlug(): string | null {
  const match = window.location.pathname.match(/^\/legal\/([^/]+)\/?$/)
  return match ? match[1] : null
}

function getQuickBooksIntegrationRoute(): "connect" | "disconnected" | null {
  const match = window.location.pathname.match(
    /^\/integrations\/quickbooks\/(connect|disconnected)\/?$/,
  )
  if (!match) return null
  return match[1] as "connect" | "disconnected"
}

function App() {
  const { state, handleSignIn, handleSignOut } = useAuth()
  const [railExpanded, toggleRail] = useRailExpanded()
  const legalSlug = getLegalSlug()
  const qboRoute = getQuickBooksIntegrationRoute()

  useEffect(() => {
    if (state.status !== "authorized") return
    if (isSettingsPath()) return
    if (legalSlug) return
    if (qboRoute) return
    const railApps = getAccessibleRailApps(state.roles)
    if (railApps.length > 0) {
      window.location.replace(railApps[0].path)
    }
  }, [state, legalSlug, qboRoute])

  const showSettings = isSettingsPath() && state.status === "authorized"

  if (showSettings && state.status === "authorized") {
    const railApps = getAccessibleRailApps(state.roles)

    return (
      <div className="flex h-screen overflow-hidden">
        <AppRail
          apps={railApps as NavApp[]}
          expanded={railExpanded}
          onToggle={toggleRail}
          userEmail={state.user.email ?? undefined}
          userPhotoURL={state.profile.photoURL}
          userDisplayName={state.profile.displayName}
          onSignOut={handleSignOut}
          getIdToken={() => state.user.getIdToken()}
        />
        <main className="flex min-w-0 flex-1 flex-col items-center overflow-y-auto bg-background text-foreground">
          <SettingsHub roles={state.roles} />
        </main>
      </div>
    )
  }

  const navProps = buildNavProps(state, handleSignIn, handleSignOut)
  const showReturnToPrompt = state.status === "signed-out" && getReturnTo()

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <GlobalNav {...navProps} />

      <main className="flex flex-1 flex-col items-center w-full">
        {legalSlug ? (
          <LegalPage slug={legalSlug} />
        ) : qboRoute ? (
          <QuickBooksIntegrationPage
            route={qboRoute}
            state={state}
            onSignIn={handleSignIn}
          />
        ) : (
          <>
            {state.status === "loading" && (
              <div className="flex flex-1 items-center">
                <p className="text-foreground-muted">Loading&hellip;</p>
              </div>
            )}

            {state.status === "init-error" && (
              <div className="flex items-center px-4 pt-12">
                <Card className="w-[min(560px,100%)] border-border bg-surface">
                  <CardContent>
                    <p className="text-error">{state.message}</p>
                  </CardContent>
                </Card>
              </div>
            )}

            {showReturnToPrompt && (
              <div className="pt-12">
                <ReturnToPrompt onSignIn={handleSignIn} />
              </div>
            )}
          </>
        )}
      </main>

      {state.status !== "loading" && <Footer />}
    </div>
  )
}

export default App
