import { useEffect } from "react"
import type { NavApp } from "../auth/app-catalog.ts"

/**
 * Prefetch sibling app entry points during browser idle time so that
 * the first cross-app navigation doesn't trigger a cold-load flicker.
 *
 * Injects `<link rel="prefetch">` for each app path (except the
 * currently active one). The browser fetches these at low priority
 * and caches the HTML + linked sub-resources for near-instant loads.
 */
export function usePrefetchApps(apps: NavApp[], activeAppId?: string) {
  useEffect(() => {
    if (apps.length === 0) return

    const siblings = apps.filter((a) => a.id !== activeAppId)
    if (siblings.length === 0) return

    const schedule =
      typeof requestIdleCallback === "function"
        ? requestIdleCallback
        : (cb: () => void) => setTimeout(cb, 2000)

    const cancel =
      typeof cancelIdleCallback === "function"
        ? cancelIdleCallback
        : (id: number) => clearTimeout(id)

    const id = schedule(() => {
      for (const app of siblings) {
        if (document.querySelector(`link[rel="prefetch"][href="${app.path}"]`)) {
          continue
        }
        const link = document.createElement("link")
        link.rel = "prefetch"
        link.href = app.path
        link.as = "document"
        document.head.appendChild(link)
      }
    })

    return () => cancel(id as number)
  }, [apps, activeAppId])
}
