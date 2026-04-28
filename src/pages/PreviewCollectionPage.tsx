import { useCallback, useEffect, useMemo, useState } from "react"
import { Link, useParams } from "react-router-dom"
import { usePreviewToken } from "../lib/usePreviewToken"
import { PreviewBanner } from "../components/PreviewBanner"
import {
  PreviewInvalidToken,
  PreviewLoading,
  PreviewNotConfigured,
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
  preview_hidden?: boolean
  data?: Record<string, unknown>
}

type CmsApiResponse = {
  docs?: CmsContentItem[]
}

type PreviewItem = {
  id: string
  slug: string
  title: string
  status: string
  metadata: string
  department?: string
}

type PreviewContent = {
  intro: RichTextValue
  items: PreviewItem[]
}

function getString(value: unknown): string {
  return typeof value === "string" ? value.trim() : ""
}

function getRichTextValue(value: unknown): RichTextValue {
  if (typeof value === "string") return value
  if (value && typeof value === "object") return value as RichTextValue
  return ""
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function normalizePreviewContent(items: CmsContentItem[]): PreviewContent {
  let intro: RichTextValue = ""

  const previewItems = items
    .filter((item) => !item.preview_hidden)
    .map((item) => {
      const data = item.data ?? {}
      const role = getString(data.role)

      if (role === "shared_intro") {
        intro = getRichTextValue(data.body)
        return null
      }

      if (role.startsWith("shared_")) {
        return null
      }

      const title = getString(data.title) || getString(data.name) || `Item ${item.id}`
      const department = getString(data.department)
      const location = getString(data.location)
      const employmentType = getString(data.employment_type)

      const metadataParts = [department, location, employmentType].filter(Boolean)

      return {
        id: String(item.id),
        slug: getString(item.slug) || slugify(title),
        title,
        status: item.workflow_status ?? "draft",
        metadata: metadataParts.join(" • "),
        department: department || undefined,
      } satisfies PreviewItem
    })
    .filter((item): item is PreviewItem => item !== null)
    .sort((left, right) => {
      const leftDept = left.department ?? ""
      const rightDept = right.department ?? ""
      if (leftDept && rightDept) {
        const deptCompare = leftDept.localeCompare(rightDept)
        if (deptCompare !== 0) return deptCompare
      }
      return left.title.localeCompare(right.title)
    })

  return { intro, items: previewItems }
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

function usePreviewContent(collection: string) {
  const [data, setData] = useState<PreviewContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const params = new URLSearchParams()
      params.set("where[org.slug][equals]", CMS_ORG_SLUG)
      params.set("where[contentType.slug][equals]", collection)
      params.set("where[workflow_status][in]", "draft,live,approved,scheduled")
      params.set("limit", "100")

      const response = await fetch(`${CMS_API_BASE}/content-items?${params.toString()}`, {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`CMS request failed (${response.status})`)
      }

      const payload = (await response.json()) as CmsApiResponse
      setData(normalizePreviewContent(payload.docs ?? []))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load content.")
    } finally {
      setIsLoading(false)
    }
  }, [collection])

  useEffect(() => {
    void load()
  }, [load])

  return { data, isLoading, error, retry: load }
}

function CollectionLoadingState() {
  return (
    <div className="space-y-4">
      <div className="h-4 w-28 animate-pulse rounded bg-accent" />
      <div className="h-12 w-full max-w-2xl animate-pulse rounded bg-accent" />
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className="rounded-2xl border border-border bg-surface p-6">
          <div className="h-5 w-72 animate-pulse rounded bg-accent" />
          <div className="mt-3 h-4 w-full max-w-md animate-pulse rounded bg-accent" />
        </div>
      ))}
    </div>
  )
}

function CollectionErrorState({ message, retry }: { message: string; retry: () => void }) {
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

function CollectionEmptyState({ collection }: { collection: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-8">
      <h2 className="text-xl font-semibold text-foreground">No content</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground-muted">
        There are no items in the "{collection}" collection yet.
      </p>
    </div>
  )
}

export function PreviewCollectionPage() {
  const { collection } = useParams<{ collection: string }>()
  const { token, validation, isValidating } = usePreviewToken()

  const { data, isLoading, error, retry } = usePreviewContent(collection ?? "")

  const groupedItems = useMemo(() => {
    const groups = new Map<string, PreviewItem[]>()

    for (const item of data?.items ?? []) {
      const dept = item.department || "General"
      const existing = groups.get(dept) ?? []
      existing.push(item)
      groups.set(dept, existing)
    }

    return Array.from(groups.entries())
  }, [data])

  if (isValidating) {
    return <PreviewLoading />
  }

  if (!validation?.valid) {
    return <PreviewInvalidToken />
  }

  if (!collection) {
    return <PreviewNotConfigured collection="unknown" />
  }

  const collectionLabel = collection.charAt(0).toUpperCase() + collection.slice(1)

  return (
    <div className="min-h-screen bg-background">
      <PreviewBanner />
      <div className="mx-auto w-full max-w-6xl px-8 py-16">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-foreground-muted">
          Preview: {collectionLabel}
        </p>
        <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
          {collectionLabel} Collection
        </h1>
        {hasRenderableContent(data?.intro) && (
          <div
            className="blog-prose mt-4 text-sm"
            dangerouslySetInnerHTML={{
              __html: renderContentToHtml(data?.intro),
            }}
          />
        )}

        <section className="mt-10">
          {isLoading && <CollectionLoadingState />}
          {!isLoading && error && <CollectionErrorState message={error} retry={retry} />}
          {!isLoading && !error && data?.items.length === 0 && (
            <CollectionEmptyState collection={collection} />
          )}
          {!isLoading && !error && data && data.items.length > 0 && (
            <div className="space-y-10">
              {groupedItems.map(([department, items]) => (
                <div key={department}>
                  <h3 className="text-lg font-semibold text-foreground">{department}</h3>
                  <div className="mt-4 space-y-4">
                    {items.map((item) => (
                      <Link
                        key={item.id}
                        to={`/preview/${collection}/${item.slug}?token=${token}`}
                        className="flex items-center justify-between rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-border-hover hover:bg-surface-hover"
                      >
                        <div>
                          <h4 className="text-lg font-semibold text-foreground">{item.title}</h4>
                          {item.metadata && (
                            <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                              {item.metadata}
                            </p>
                          )}
                        </div>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${STATUS_COLORS[item.status] ?? "bg-gray-100 text-gray-700"}`}
                        >
                          {STATUS_LABELS[item.status] ?? item.status}
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
