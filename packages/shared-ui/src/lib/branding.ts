import { useState, useEffect } from "react"

const BASE = "/agent/api"

export type LockupMode = "none" | "text" | "swap"

export interface Branding {
  logoSvg: string | null
  lockupSvg: string | null
  lockupMode: LockupMode
}

let cachedBranding: Branding | null | undefined = undefined
let brandingInFlight: Promise<Branding | null> | null = null

function getBrandingOnce(): Promise<Branding | null> {
  if (cachedBranding !== undefined) {
    return Promise.resolve(cachedBranding)
  }
  if (brandingInFlight) {
    return brandingInFlight
  }
  brandingInFlight = fetchBranding()
    .then((result) => {
      cachedBranding = result
      return result
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
    return (await res.json()) as Branding
  } catch {
    return null
  }
}

export function useBranding(): Branding | null {
  const [branding, setBranding] = useState<Branding | null>(() =>
    cachedBranding !== undefined ? cachedBranding : null
  )

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
