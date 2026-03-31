import { useState, useEffect } from "react"

const BASE = "/agent/api"

export type LockupMode = "none" | "text" | "swap"

export interface Branding {
  logoSvg: string | null
  lockupSvg: string | null
  lockupMode: LockupMode
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
  const [branding, setBranding] = useState<Branding | null>(null)

  useEffect(() => {
    fetchBranding().then(setBranding)
  }, [])

  return branding
}
