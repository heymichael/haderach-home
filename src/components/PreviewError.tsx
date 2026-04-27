import { Link } from "react-router-dom"

export function PreviewInvalidToken() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-8">
      <div className="max-w-md rounded-2xl border border-border bg-surface p-8 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Invalid Preview Token</h1>
        <p className="mt-4 text-sm leading-relaxed text-foreground-muted">
          The preview link you followed is invalid. Please request a new preview
          link from the CMS.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-border-hover hover:bg-accent"
        >
          Go to homepage
        </Link>
      </div>
    </div>
  )
}

export function PreviewExpiredToken() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-8">
      <div className="max-w-md rounded-2xl border border-border bg-surface p-8 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Preview Link Expired</h1>
        <p className="mt-4 text-sm leading-relaxed text-foreground-muted">
          Preview links expire after 30 minutes for security. Please request a
          new preview link from the CMS.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-border-hover hover:bg-accent"
        >
          Go to homepage
        </Link>
      </div>
    </div>
  )
}

export function PreviewNotFound({ collection }: { collection: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-8">
      <div className="max-w-md rounded-2xl border border-border bg-surface p-8 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Content Not Found</h1>
        <p className="mt-4 text-sm leading-relaxed text-foreground-muted">
          No content found in the "{collection}" collection, or the item you're
          looking for doesn't exist.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-border-hover hover:bg-accent"
        >
          Go to homepage
        </Link>
      </div>
    </div>
  )
}

export function PreviewNotConfigured({ collection }: { collection: string }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-8">
      <div className="max-w-md rounded-2xl border border-border bg-surface p-8 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Preview Not Available</h1>
        <p className="mt-4 text-sm leading-relaxed text-foreground-muted">
          Preview is not configured for the "{collection}" collection. Contact
          the site administrator.
        </p>
        <Link
          to="/"
          className="mt-6 inline-block rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-border-hover hover:bg-accent"
        >
          Go to homepage
        </Link>
      </div>
    </div>
  )
}

export function PreviewLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-8">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-border border-t-foreground" />
        <p className="mt-4 text-sm text-foreground-muted">Validating preview token...</p>
      </div>
    </div>
  )
}
