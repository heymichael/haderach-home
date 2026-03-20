import { Button, Card, CardContent } from "@haderach/shared-ui"
import { useAuth } from "./auth/useAuth.ts"

function App() {
  const { state, handleSignIn, handleSignOut } = useAuth()

  return (
    <div className="flex min-h-screen flex-col items-center bg-background text-foreground">
      <main className="flex flex-1 flex-col items-center w-full pt-8">
        {state.status === "loading" && (
          <div className="flex flex-1 items-center">
            <p className="text-foreground-muted">Loading&hellip;</p>
          </div>
        )}

        {state.status === "init-error" && (
          <div className="flex flex-1 items-center">
            <Card className="w-[min(560px,100%)] border-border bg-surface">
              <CardContent>
                <p className="text-error">{state.message}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {state.status === "signed-out" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8">
            <p className="text-foreground-muted">
              Sign in with your Google account to continue.
            </p>
            <Button
              variant="outline"
              onClick={handleSignIn}
              className="border-border text-foreground hover:border-border-hover hover:bg-surface-hover"
            >
              Sign in with Google
            </Button>
          </div>
        )}

        {state.status === "authorized" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
            <nav className="flex gap-4">
              {state.apps.map((app) => (
                <a
                  key={app.id}
                  href={app.path}
                  className="rounded-md border border-border px-5 py-2.5 text-lg tracking-wide text-foreground-muted transition-colors hover:border-border-hover hover:text-foreground"
                >
                  {app.label}
                </a>
              ))}
            </nav>
            <p className="text-sm text-foreground-muted">
              Signed in as <strong>{state.user.email}</strong>
            </p>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="border-border text-foreground hover:border-border-hover hover:bg-surface-hover"
            >
              Sign out
            </Button>
          </div>
        )}

        {state.status === "no-access" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
            <p>
              You are signed in as <strong>{state.user.email}</strong>, but
              your account does not have access to any applications.
            </p>
            <p className="text-foreground-muted">
              Please contact your administrator to be granted access.
            </p>
            <Button
              variant="outline"
              onClick={handleSignOut}
              className="border-border text-foreground hover:border-border-hover hover:bg-surface-hover"
            >
              Sign out
            </Button>
          </div>
        )}

        <div className="flex-1" />
        <img
          className="w-[min(70vw,760px)] h-auto"
          src="/assets/landing/logo.svg"
          alt="Haderach"
        />
        <div className="flex-[2]" />
      </main>
    </div>
  )
}

export default App
