import { useState, useEffect } from "react"

const BASE = "/agent/api"
const BRANDING_STORAGE_KEY_PREFIX = "haderach-branding-v1:"

function getOrgFromHostname(): string {
  if (typeof window === "undefined") return "haderach"
  const hostname = window.location.hostname
  if (hostname.startsWith("arcade.")) {
    return "arcade"
  }
  return "haderach"
}

function getBrandingStorageKey(): string {
  return `${BRANDING_STORAGE_KEY_PREFIX}${getOrgFromHostname()}`
}

export type LockupMode = "none" | "text" | "swap"

export interface Branding {
  logoSvg: string | null
  lockupSvg: string | null
  lockupMode: LockupMode
}

export interface BrandingState {
  branding: Branding | null
  resolved: boolean
}

let cachedBranding: Branding | null | undefined = undefined
let brandingInFlight: Promise<Branding | null> | null = null

function isBranding(value: unknown): value is Branding {
  if (!value || typeof value !== "object") return false
  const candidate = value as Partial<Branding>
  const lockupModeValid =
    candidate.lockupMode === "none" ||
    candidate.lockupMode === "text" ||
    candidate.lockupMode === "swap"
  const logoValid = candidate.logoSvg === null || typeof candidate.logoSvg === "string"
  const lockupValid = candidate.lockupSvg === null || typeof candidate.lockupSvg === "string"
  return lockupModeValid && logoValid && lockupValid
}

function readStoredBranding(): Branding | null | undefined {
  try {
    const raw = localStorage.getItem(getBrandingStorageKey())
    if (!raw) return undefined
    const parsed = JSON.parse(raw) as unknown
    return isBranding(parsed) ? parsed : undefined
  } catch {
    return undefined
  }
}

function writeStoredBranding(branding: Branding | null): void {
  try {
    const key = getBrandingStorageKey()
    if (!branding) {
      localStorage.removeItem(key)
      return
    }
    localStorage.setItem(key, JSON.stringify(branding))
  } catch {
    // Ignore storage availability and quota failures.
  }
}

export function clearBrandingCache(): void {
  cachedBranding = undefined
  try {
    for (const key of Object.keys(localStorage)) {
      if (key.startsWith(BRANDING_STORAGE_KEY_PREFIX)) {
        localStorage.removeItem(key)
      }
    }
  } catch {
    // Ignore storage availability failures.
  }
}

export function resetBrandingState(): void {
  cachedBranding = undefined
  brandingInFlight = null
}

function resolveWithStickyBranding(next: Branding | null): Branding | null {
  if (next) {
    cachedBranding = next
    writeStoredBranding(next)
    return next
  }

  if (cachedBranding) {
    // Keep last good branding to avoid fallback logo flashes.
    return cachedBranding
  }

  const stored = readStoredBranding()
  if (stored) {
    cachedBranding = stored
    return stored
  }

  return null
}

function getBrandingOnce(): Promise<Branding | null> {
  if (cachedBranding !== undefined) {
    return Promise.resolve(cachedBranding)
  }
  if (brandingInFlight) {
    return brandingInFlight
  }
  brandingInFlight = fetchBranding()
    .then((result) => {
      const resolved = resolveWithStickyBranding(result)
      cachedBranding = resolved
      return resolved
    })
    .finally(() => {
      brandingInFlight = null
    })
  return brandingInFlight
}

export async function fetchBranding(): Promise<Branding | null> {
  try {
    const res = await fetch(`${BASE}/branding`)
    if (!res.ok) return null
    const parsed = (await res.json()) as unknown
    return isBranding(parsed) ? parsed : null
  } catch {
    return null
  }
}

export function useBranding(): Branding | null {
  return useBrandingState().branding
}

export function useBrandingState(): BrandingState {
  const [branding, setBranding] = useState<Branding | null>(() => {
    if (cachedBranding === undefined) {
      cachedBranding = readStoredBranding()
    }
    return cachedBranding ?? null
  })
  const [resolved, setResolved] = useState<boolean>(() => cachedBranding !== undefined)

  useEffect(() => {
    if (cachedBranding !== undefined) {
      return
    }
    let cancelled = false
    getBrandingOnce().then((result) => {
      if (!cancelled) {
        setBranding(result)
        setResolved(true)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  return { branding, resolved }
}
