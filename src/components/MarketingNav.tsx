import { useState, useRef, useEffect } from "react"
import { Link } from "react-router-dom"

const PRODUCTS = [
  { label: "SaaS Spend Monitoring", href: "#" },
]

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 6l4 4 4-4" />
    </svg>
  )
}

export function MarketingNav({
  onSignIn,
  showInvestors = false,
}: {
  onSignIn?: () => void
  showInvestors?: boolean
}) {
  const [productsOpen, setProductsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setProductsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <nav className="mx-auto flex h-16 max-w-6xl items-center px-8">
        <Link to="/" className="shrink-0">
          <img
            className="h-10 w-auto"
            src="/assets/landing/logo_lockup.svg"
            alt="Haderach"
          />
        </Link>

        <div className="hidden flex-1 items-center justify-center gap-6 sm:flex">
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setProductsOpen(!productsOpen)}
              className="inline-flex items-center gap-1 text-sm text-foreground-muted transition-colors hover:text-foreground"
            >
              Products
              <ChevronDown
                className={`transition-transform ${productsOpen ? "rotate-180" : ""}`}
              />
            </button>
            {productsOpen && (
              <div className="absolute left-0 top-full mt-2 w-56 rounded-lg border border-border bg-background p-2 shadow-lg">
                <p className="px-3 py-1.5 text-xs font-medium uppercase tracking-widest text-foreground-muted">
                  Products
                </p>
                {PRODUCTS.map((product) => (
                  <a
                    key={product.label}
                    href={product.href}
                    className="block rounded-md px-3 py-2 text-sm text-foreground transition-colors hover:bg-accent"
                  >
                    {product.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <Link
            to="/team"
            className="text-sm text-foreground-muted transition-colors hover:text-foreground"
          >
            Team
          </Link>
          <Link
            to="/blog"
            className="text-sm text-foreground-muted transition-colors hover:text-foreground"
          >
            Blog
          </Link>
          <Link
            to="/careers"
            className="text-sm text-foreground-muted transition-colors hover:text-foreground"
          >
            Careers
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {showInvestors && (
            <Link
              to="/investors"
              className="text-sm text-foreground-muted transition-colors hover:text-foreground"
            >
              Investors
            </Link>
          )}
          {onSignIn ? (
            <button
              onClick={onSignIn}
              className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
            >
              Sign in
            </button>
          ) : (
            <span className="text-sm text-foreground-muted">Signed in</span>
          )}
        </div>
      </nav>
    </header>
  )
}
