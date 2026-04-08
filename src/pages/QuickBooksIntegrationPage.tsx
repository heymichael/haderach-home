import { useEffect } from "react"
import { Button, Card, CardContent } from "@haderach/shared-ui"
import type { AuthState } from "../auth/use-auth.ts"

type QuickBooksRoute = "connect" | "disconnected"

export function QuickBooksIntegrationPage({
  route,
  state,
  onSignIn,
}: {
  route: QuickBooksRoute
  state: AuthState
  onSignIn: () => void
}) {
  const isAdmin = state.status === "authorized" && state.roles.includes("admin")

  useEffect(() => {
    if (route !== "connect") return
    if (!isAdmin) return
    window.location.replace("/agent/api/qbo/auth")
  }, [route, isAdmin])

  if (route === "disconnected") {
    return (
      <div className="flex w-full flex-1 items-center justify-center px-4 py-12">
        <Card className="w-[min(640px,100%)] border-border bg-surface">
          <CardContent className="space-y-4 text-center">
            <h1 className="text-2xl font-semibold text-foreground">
              QuickBooks disconnected
            </h1>
            <p className="text-foreground-muted">
              Your QuickBooks connection is no longer active. Reconnect to resume
              vendor and spend syncing.
            </p>
            <div>
              <a href="/integrations/quickbooks/connect">
                <Button>Reconnect QuickBooks</Button>
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (state.status === "loading") {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <p className="text-foreground-muted">Loading&hellip;</p>
      </div>
    )
  }

  if (state.status === "init-error") {
    return (
      <div className="flex w-full flex-1 items-center justify-center px-4 py-12">
        <Card className="w-[min(640px,100%)] border-border bg-surface">
          <CardContent>
            <p className="text-error">{state.message}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (state.status === "signed-out") {
    return (
      <div className="flex w-full flex-1 items-center justify-center px-4 py-12">
        <Card className="w-[min(640px,100%)] border-border bg-surface">
          <CardContent className="space-y-4 text-center">
            <h1 className="text-2xl font-semibold text-foreground">
              Connect QuickBooks
            </h1>
            <p className="text-foreground-muted">
              Sign in with your Haderach admin account to continue to Intuit
              authorization.
            </p>
            <div>
              <Button onClick={onSignIn}>Sign in with Google</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="flex w-full flex-1 items-center justify-center px-4 py-12">
        <Card className="w-[min(640px,100%)] border-border bg-surface">
          <CardContent className="space-y-3 text-center">
            <h1 className="text-2xl font-semibold text-foreground">
              Admin access required
            </h1>
            <p className="text-foreground-muted">
              Only Haderach admins can connect QuickBooks. Ask an admin to
              complete this setup.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-16">
      <p className="text-foreground-muted">
        Redirecting to Intuit authorization&hellip;
      </p>
    </div>
  )
}
