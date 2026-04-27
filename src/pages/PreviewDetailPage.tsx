import { useCallback, useEffect, useState } from "react"
import { Link, useParams, useSearchParams } from "react-router-dom"
import { usePreviewToken } from "../lib/usePreviewToken"
import { PreviewBanner } from "../components/PreviewBanner"
import {
  PreviewInvalidToken,
  PreviewLoading,
  PreviewNotFound,
} from "../components/PreviewError"
import {
  hasRenderableContent,
  renderContentToHtml,
  type RichTextValue,
} from "../lib/cmsRichText"

const CMS_API_BASE =
  (import.meta.env.VITE_CMS_API_BASE as string | undefined) ?? "/cms/api"
const CMS_ORG_SLUG =
  (import.meta.env.VITE_CMS_ORG_SLUG as string | undefined) ?? "haderach"

type CmsContentItem = {
  id: number | string
  slug: string | null
  workflow_status?: string
  data?: Record<string, unknown>
}

type CmsApiResponse = {
  docs?: CmsContentItem[]
}

type PreviewItemDetail = {
  id: string
  slug: string
  title: string
  status: string
  data: Record<string, unknown>
}

function getString(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

function getRichTextValue(value: unknown): RichTextValue {
  if (typeof value === "string") return value
  if (value && typeof value === "object") return value as RichTextValue
  return ""
}

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-gray-100 text-gray-700",
  needs_approval: "bg-amber-100 text-amber-800",
  changes_requested: "bg-red-100 text-red-800",
  approved: "bg-purple-100 text-purple-800",
  scheduled: "bg-blue-100 text-blue-800",
  live: "bg-green-100 text-green-800",
}

const STATUS_LABELS: Record<string, string> = {
  draft: "Draft",
  needs_approval: "Needs Approval",
  changes_requested: "Changes Requested",
  approved: "Approved",
  scheduled: "Scheduled",
  live: "Live",
}

function usePreviewItem(collection: string, slug: string) {
  const [item, setItem] = useState<PreviewItemDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      params.set("where[org.slug][equals]", CMS_ORG_SLUG)
      params.set("where[contentType.slug][equals]", collection)
      params.set("where[slug][equals]", slug)
      params.set("where[workflow_status][in]", "draft,live,approved,scheduled")
      params.set("limit", "1")

      const response = await fetch(`${CMS_API_BASE}/content-items?${params.toString()}`, {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`CMS request failed (${response.status})`)
      }

      const payload = (await response.json()) as CmsApiResponse
      const doc = payload.docs?.[0]

      if (!doc) {
        setItem(null)
      } else {
        const data = doc.data ?? {}
        setItem({
          id: String(doc.id),
          slug: getString(doc.slug) || slug,
          title: getString(data.title) || getString(data.name) || `Item ${doc.id}`,
          status: doc.workflow_status ?? "draft",
          data,
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load content.")
    } finally {
      setIsLoading(false)
    }
  }, [collection, slug])

  useEffect(() => {
    void load()
  }, [load])

  return { item, isLoading, error, retry: load }
}

function ItemLoadingState() {
  return (
    <div className="space-y-6">
      <div className="h-4 w-20 animate-pulse rounded bg-accent" />
      <div className="h-10 w-full max-w-xl animate-pulse rounded bg-accent" />
      <div className="h-6 w-full max-w-md animate-pulse rounded bg-accent" />
      <div className="mt-8 space-y-4">
        <div className="h-6 w-40 animate-pulse rounded bg-accent" />
        <div className="h-32 w-full animate-pulse rounded bg-accent" />
      </div>
    </div>
  )
}

function ItemErrorState({ message, retry }: { message: string; retry: () => void }) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-8">
      <h2 className="text-xl font-semibold text-foreground">Unable to load content</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground-muted">
        {message}
      </p>
      <button
        type="button"
        onClick={retry}
        className="mt-6 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-border-hover hover:bg-accent"
      >
        Retry
      </button>
    </div>
  )
}

function RichTextSection({ title, content }: { title: string; content: RichTextValue }) {
  if (!hasRenderableContent(content)) return null

  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
      <div
        className="blog-prose mt-5 max-w-none"
        dangerouslySetInnerHTML={{ __html: renderContentToHtml(content) }}
      />
    </section>
  )
}

function MetadataItem({ label, value }: { label: string; value: string }) {
  if (!value) return null

  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-[0.14em] text-foreground-muted">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-foreground">{value}</dd>
    </div>
  )
}

export function PreviewDetailPage() {
  const { collection, slug } = useParams<{ collection: string; slug: string }>()
  const [searchParams] = useSearchParams()
  const token = searchParams.get("token")
  const { validation, isValidating } = usePreviewToken()

  const { item, isLoading, error, retry } = usePreviewItem(collection ?? "", slug ?? "")

  if (isValidating) {
    return <PreviewLoading />
  }

  if (!validation?.valid) {
    return <PreviewInvalidToken />
  }

  if (!collection || !slug) {
    return <PreviewNotFound collection={collection ?? "unknown"} />
  }

  const collectionLabel = collection.charAt(0).toUpperCase() + collection.slice(1)

  return (
    <div className="min-h-screen bg-background">
      <PreviewBanner />
      <div className="mx-auto w-full max-w-6xl px-8 py-16">
        <Link
          to={`/preview/${collection}?token=${token}`}
          className="text-sm text-foreground-muted transition-colors hover:text-foreground"
        >
          &larr; Back to {collectionLabel}
        </Link>

        {isLoading && (
          <div className="mt-8">
            <ItemLoadingState />
          </div>
        )}

        {!isLoading && error && (
          <div className="mt-8">
            <ItemErrorState message={error} retry={retry} />
          </div>
        )}

        {!isLoading && !error && !item && <PreviewNotFound collection={collection} />}

        {!isLoading && !error && item && (
          <div className="mt-8">
            <header>
              <div className="flex items-center gap-3">
                <p className="text-sm font-medium uppercase tracking-[0.2em] text-foreground-muted">
                  Preview: {collectionLabel}
                </p>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[item.status] ?? "bg-gray-100 text-gray-700"}`}
                >
                  {STATUS_LABELS[item.status] ?? item.status}
                </span>
              </div>
              <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
                {item.title}
              </h1>

              <div className="mt-6 flex flex-wrap gap-x-8 gap-y-4">
                <MetadataItem label="Department" value={getString(item.data.department)} />
                <MetadataItem label="Location" value={getString(item.data.location)} />
                <MetadataItem label="Employment Type" value={getString(item.data.employment_type)} />
                <MetadataItem label="Location Type" value={getString(item.data.location_type)} />
              </div>
            </header>

            <div className="mt-12 max-w-3xl space-y-12">
              <RichTextSection
                title="Responsibilities"
                content={getRichTextValue(item.data.responsibilities)}
              />
              <RichTextSection
                title="Qualifications"
                content={getRichTextValue(item.data.qualifications)}
              />
              <RichTextSection title="Description" content={getRichTextValue(item.data.body)} />
              <RichTextSection title="Content" content={getRichTextValue(item.data.content)} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
