import { useState, useEffect } from "react"

const BASE = "/agent/api"
const BRANDING_STORAGE_KEY = "haderach-branding-cache-v1"

export type LockupMode = "none" | "text" | "swap"

export interface Branding {
  logoSvg: string | null
  lockupSvg: string | null
  lockupMode: LockupMode
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
    const raw = localStorage.getItem(BRANDING_STORAGE_KEY)
    if (!raw) return undefined
    const parsed = JSON.parse(raw) as unknown
    return isBranding(parsed) ? parsed : undefined
  } catch {
    return undefined
  }
}

function writeStoredBranding(branding: Branding | null): void {
  try {
    if (!branding) {
      localStorage.removeItem(BRANDING_STORAGE_KEY)
      return
    }
    localStorage.setItem(BRANDING_STORAGE_KEY, JSON.stringify(branding))
  } catch {
    // Ignore storage availability and quota failures.
  }
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
  const [branding, setBranding] = useState<Branding | null>(() => {
    if (cachedBranding === undefined) {
      cachedBranding = readStoredBranding()
    }
    return cachedBranding ?? null
  })

  useEffect(() => {
    if (cachedBranding !== undefined) {
      return
    }
    let cancelled = false
    getBrandingOnce().then((result) => {
      if (!cancelled) {
        setBranding(result)
      }
    })
    return () => {
      cancelled = true
    }
  }, [])

  return branding
}
