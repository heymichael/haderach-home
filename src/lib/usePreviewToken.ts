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
  const [validation, setValidation] = useState<TokenValidation | null>(null)
  const [isValidating, setIsValidating] = useState(false)

  useEffect(() => {
    if (!token) {
      setValidation({ valid: false, error: "Missing token" })
      return
    }

    setIsValidating(true)

    fetch(`${CMS_API_BASE}/preview-token/validate?token=${encodeURIComponent(token)}`)
      .then((r) => r.json())
      .then((data: TokenValidation) => {
        setValidation(data)
      })
      .catch(() => {
        setValidation({ valid: false, error: "Failed to validate token" })
      })
      .finally(() => {
        setIsValidating(false)
      })
  }, [token])

  return { token, validation, isValidating, isPreview: !!token }
}
