import { useState, useEffect } from "react"
import { useSearchParams } from "react-router-dom"

const CMS_API_BASE =
  (import.meta.env.VITE_CMS_API_BASE as string | undefined) ?? "/cms/api"

export interface TokenValidation {
  valid: boolean
  org?: string
  collection?: string
  error?: string
}

export function usePreviewToken() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const [validation, setValidation] = useState<TokenValidation | null>(
    token ? null : { valid: false, error: "Missing token" }
  )

  useEffect(() => {
    if (!token) {
      return
    }

    const controller = new AbortController()

    fetch(`${CMS_API_BASE}/preview-token/validate?token=${encodeURIComponent(token)}`, {
      signal: controller.signal,
    })
      .then((r) => r.json())
      .then((data: TokenValidation) => {
        if (!controller.signal.aborted) {
          setValidation(data)
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted && err.name !== "AbortError") {
          setValidation({ valid: false, error: "Failed to validate token" })
        }
      })

    return () => {
      controller.abort()
    }
  }, [token])

  const isValidating = token !== null && validation === null

  return { token, validation, isValidating, isPreview: !!token }
}
