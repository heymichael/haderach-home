import { useEffect } from "react"
import { GlobalNav, AppRail, useRailExpanded, Card, CardContent, getAccessibleRailApps } from "@haderach/shared-ui"
import type { NavApp } from "@haderach/shared-ui"
import { useAuth, type AuthState } from "./auth/use-auth.ts"
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
          </>
        )}
      </main>

      {state.status !== "loading" && <Footer />}
    </div>
  )
}

export default App
