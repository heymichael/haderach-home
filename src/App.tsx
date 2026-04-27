import { Routes, Route, useSearchParams, useLocation } from "react-router-dom"
import { useEffect } from "react"
import {
  GlobalNav,
  AppRail,
  useRailExpanded,
  Card,
  CardContent,
  getAccessibleRailApps,
} from "@haderach/shared-ui"
import type { NavApp } from "@haderach/shared-ui"
import { useAuth, type AuthState } from "./auth/use-auth.ts"
import { SettingsHub } from "./SettingsHub.tsx"
import { Footer } from "./components/Footer.tsx"
import { MarketingNav } from "./components/MarketingNav.tsx"
import { LegalPage } from "./pages/LegalPage.tsx"
import { QuickBooksIntegrationPage } from "./pages/QuickBooksIntegrationPage.tsx"
import { HomePage } from "./pages/HomePage.tsx"
import { BlogIndexPage } from "./pages/BlogIndexPage.tsx"
import { BlogPostPage } from "./pages/BlogPostPage.tsx"
import { CareerDetailPage, CareersPage } from "./pages/CareersPage.tsx"
import { TeamPage } from "./pages/TeamPage.tsx"
import { InvestorsPage } from "./pages/InvestorsPage.tsx"
import { SaasBillingVisibilityPage } from "./pages/SaasBillingVisibilityPage.tsx"
import { PreviewCollectionPage } from "./pages/PreviewCollectionPage.tsx"
import { PreviewDetailPage } from "./pages/PreviewDetailPage.tsx"

const MARKETING_PATHS = [
  "/",
  "/blog",
  "/careers",
  "/team",
  "/investors",
  "/products/saas-billing-visibility",
]

function isMarketingPath(pathname: string): boolean {
  return (
    MARKETING_PATHS.includes(pathname) ||
    pathname.startsWith("/blog/") ||
    pathname.startsWith("/careers/") ||
    pathname.startsWith("/products/")
  )
}

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

function SettingsRoute({
  state,
  handleSignOut,
}: {
  state: Extract<AuthState, { status: "authorized" }>
  handleSignOut: () => void
}) {
  const [railExpanded, toggleRail] = useRailExpanded()
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

function ReturnToHandler({ roles }: { roles: string[] }) {
  const [searchParams] = useSearchParams()
  const returnTo = searchParams.get("returnTo")

  useEffect(() => {
    if (!returnTo || !returnTo.startsWith("/")) return
    const railApps = getAccessibleRailApps(roles)
    const match = railApps.some((app) => returnTo.startsWith(app.path))
    if (match) {
      window.location.replace(returnTo)
    }
  }, [returnTo, roles])

  return null
}

function App() {
  const { state, handleSignIn, handleSignOut } = useAuth()
  const location = useLocation()

  // Preview routes are token-authenticated, not session-authenticated
  if (location.pathname.startsWith("/preview/")) {
    return (
      <Routes>
        <Route path="/preview/:collection" element={<PreviewCollectionPage />} />
        <Route path="/preview/:collection/:slug" element={<PreviewDetailPage />} />
      </Routes>
    )
  }

  if (
    state.status === "authorized" &&
    (location.pathname === "/admin" || location.pathname === "/admin/")
  ) {
    return <SettingsRoute state={state} handleSignOut={handleSignOut} />
  }

  const marketing = isMarketingPath(location.pathname)
  const roles =
    state.status === "authorized" ? state.roles : []
  const hasHome = roles.includes("home")
  const hasInvestor = roles.includes("investor")

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      {marketing ? (
        <MarketingNav
          onSignIn={state.status === "signed-out" ? handleSignIn : undefined}
          showInvestors={hasInvestor}
        />
      ) : (
        <GlobalNav {...buildNavProps(state, handleSignIn, handleSignOut)} />
      )}

      <main className="flex flex-1 flex-col items-center w-full">
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

        {state.status === "signed-out" && (
          <div className="flex flex-1 items-center justify-center px-8 py-20">
            <p className="text-sm text-foreground-muted">
              Sign in to continue.
            </p>
          </div>
        )}

        {state.status === "no-access" && (
          <div className="flex flex-1 items-center justify-center px-8 py-20">
            <p className="text-sm text-foreground-muted">
              You don't have access. Contact support@haderach.ai if you
              believe this is an error.
            </p>
          </div>
        )}

        {state.status === "authorized" && !hasHome && !hasInvestor && (
          <div className="flex flex-1 items-center justify-center px-8 py-20">
            <p className="text-sm text-foreground-muted">
              You don't have access to this page.
            </p>
          </div>
        )}

        {state.status === "authorized" && (hasHome || hasInvestor) && (
          <Routes>
            {hasHome && (
              <>
                <Route path="/" element={<HomePage />} />
                <Route path="/blog" element={<BlogIndexPage />} />
                <Route path="/blog/:slug" element={<BlogPostPage />} />
                <Route path="/careers" element={<CareersPage />} />
                <Route path="/careers/:slug" element={<CareerDetailPage />} />
                <Route path="/team" element={<TeamPage />} />
              </>
            )}
            <Route
              path="/products/saas-billing-visibility"
              element={<SaasBillingVisibilityPage />}
            />
            {hasInvestor && (
              <Route path="/investors" element={<InvestorsPage />} />
            )}
            <Route path="/legal/:slug" element={<LegalPage />} />
            <Route
              path="/integrations/quickbooks/connect"
              element={
                <QuickBooksIntegrationPage
                  route="connect"
                  state={state}
                  onSignIn={handleSignIn}
                />
              }
            />
            <Route
              path="/integrations/quickbooks/disconnected"
              element={
                <QuickBooksIntegrationPage
                  route="disconnected"
                  state={state}
                  onSignIn={handleSignIn}
                />
              }
            />
          </Routes>
        )}

        {state.status === "authorized" && (
          <ReturnToHandler roles={state.roles} />
        )}
      </main>

      {state.status !== "loading" && <Footer />}
    </div>
  )
}

export default App
