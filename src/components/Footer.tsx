export function Footer() {
  return (
    <footer className="w-full border-t border-border bg-background py-4">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-center gap-x-6 gap-y-2 px-4 text-sm text-foreground-muted">
        <a href="/legal/privacy" className="hover:text-foreground transition-colors">
          Privacy Policy
        </a>
        <a href="/legal/terms" className="hover:text-foreground transition-colors">
          Terms &amp; Conditions
        </a>
        <a href="/legal/eula" className="hover:text-foreground transition-colors">
          EULA
        </a>
        <span className="hidden sm:inline">·</span>
        <span>&copy; {new Date().getFullYear()} Haderach, LLC</span>
      </div>
    </footer>
  )
}
