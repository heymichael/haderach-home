import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import { Link, useParams } from "react-router-dom"
import {
  hasRenderableContent,
  renderContentToHtml,
  type RichTextValue,
} from "../lib/cmsRichText.ts"

const CMS_API_BASE =
  (import.meta.env.VITE_CMS_API_BASE as string | undefined) ?? "/cms/api"
const CMS_ORG_SLUG =
  (import.meta.env.VITE_CMS_ORG_SLUG as string | undefined) ?? "haderach"

type CmsContentItem = {
  id: number | string
  slug: string | null
  data?: Record<string, unknown>
}

type CmsApiResponse = {
  docs?: CmsContentItem[]
}

type CareerJob = {
  id: string
  slug: string
  title: string
  department: string
  location: string
  employmentType: string
  locationType: string
  responsibilities: RichTextValue
  qualifications: RichTextValue
}

type CareersContent = {
  intro: RichTextValue
  closing: RichTextValue
  jobs: CareerJob[]
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

function normalizeCareersContent(items: CmsContentItem[]): CareersContent {
  let intro: RichTextValue = ""
  let closing: RichTextValue = ""

  const jobs = items
    .map((item) => {
      const data = item.data ?? {}
      const role = getString(data.role)

      if (role === "shared_intro") {
        intro = getRichTextValue(data.body)
        return null
      }

      if (role === "shared_closing") {
        closing = getRichTextValue(data.body)
        return null
      }

      const title = getString(data.title)
      if (!title) return null

      return {
        id: String(item.id),
        slug: getString(item.slug) || slugify(title),
        title,
        department: getString(data.department) || "General",
        location: getString(data.location),
        employmentType: getString(data.employment_type),
        locationType: getString(data.location_type),
        responsibilities: getRichTextValue(data.responsibilities),
        qualifications: getRichTextValue(data.qualifications),
      } satisfies CareerJob
    })
    .filter((job): job is CareerJob => job !== null)
    .sort((left, right) => {
      const departmentCompare = left.department.localeCompare(right.department)
      if (departmentCompare !== 0) return departmentCompare
      return left.title.localeCompare(right.title)
    })

  return { intro, closing, jobs }
}

function buildCareersQuery(): string {
  const params = new URLSearchParams()
  params.set("where[org.slug][equals]", CMS_ORG_SLUG)
  params.set("where[contentType.slug][equals]", "jobs")
  params.set("where[workflow_status][equals]", "live")
  params.set("limit", "100")
  return `${CMS_API_BASE}/content-items?${params.toString()}`
}

function useCareersContent() {
  const [data, setData] = useState<CareersContent | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(buildCareersQuery(), { cache: "no-store" })
      if (!response.ok) {
        throw new Error(`CMS request failed (${response.status})`)
      }

      const payload = (await response.json()) as CmsApiResponse
      setData(normalizeCareersContent(payload.docs ?? []))
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to load current openings right now.",
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    void load()
  }, [load])

  return { data, isLoading, error, retry: load }
}

function CareerMetadata({ job }: { job: CareerJob }) {
  const items = [
    ["Location", job.location],
    ["Employment Type", job.employmentType],
    ["Location Type", job.locationType],
    ["Department", job.department],
  ].filter(([, value]) => value)

  return (
    <div className="flex flex-wrap gap-x-8 gap-y-4">
      {items.map(([label, value]) => (
        <div key={label}>
          <dt className="text-xs font-medium uppercase tracking-[0.14em] text-foreground-muted">
            {label}
          </dt>
          <dd className="mt-1 text-sm text-foreground">{value}</dd>
        </div>
      ))}
    </div>
  )
}

function RichTextSection({
  title,
  content,
}: {
  title: string
  content: RichTextValue
}) {
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

function CareersLoadingState() {
  return (
    <div className="space-y-10">
      <div className="space-y-4">
        <div className="h-4 w-28 animate-pulse rounded bg-accent" />
        <div className="h-12 w-full max-w-2xl animate-pulse rounded bg-accent" />
        <div className="h-24 w-full max-w-3xl animate-pulse rounded bg-accent" />
      </div>
      <div className="space-y-4">
        <div className="h-4 w-40 animate-pulse rounded bg-accent" />
        {[0, 1, 2, 3].map((item) => (
          <div
            key={item}
            className="rounded-2xl border border-border bg-surface p-6"
          >
            <div className="h-5 w-72 animate-pulse rounded bg-accent" />
            <div className="mt-3 h-4 w-full max-w-md animate-pulse rounded bg-accent" />
          </div>
        ))}
      </div>
    </div>
  )
}

function CareersErrorState({
  message,
  retry,
}: {
  message: string
  retry: () => void
}) {
  return (
    <div className="rounded-2xl border border-border bg-surface p-8">
      <h2 className="text-xl font-semibold text-foreground">
        Current openings are temporarily unavailable.
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground-muted">
        {message} You can retry now or reach out at{" "}
        <a
          href="mailto:support@haderach.ai"
          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
        >
          support@haderach.ai
        </a>
        .
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

function CareersEmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-border p-8">
      <h2 className="text-xl font-semibold text-foreground">
        No live openings right now
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-foreground-muted">
        We are not currently hiring for this team. If you think you would be a
        strong fit for future roles, contact{" "}
        <a
          href="mailto:support@haderach.ai"
          className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
        >
          support@haderach.ai
        </a>
        .
      </p>
    </div>
  )
}

function CareersNotFoundState() {
  return (
    <div className="rounded-2xl border border-border bg-surface p-8">
      <h2 className="text-xl font-semibold text-foreground">Role not found</h2>
      <p className="mt-3 text-sm leading-relaxed text-foreground-muted">
        That listing is not live, or the slug does not match a current opening.
      </p>
      <Link
        to="/careers"
        className="mt-6 inline-flex text-sm text-foreground-muted transition-colors hover:text-foreground"
      >
        &larr; Back to all openings
      </Link>
    </div>
  )
}

function CareersPageShell({
  children,
  showBackLink = false,
}: {
  children: ReactNode
  showBackLink?: boolean
}) {
  return (
    <div className="w-full">
      <section className="mx-auto w-full max-w-6xl px-8 pt-16 pb-20">
        {children}
      </section>
      {showBackLink && (
        <section className="mx-auto w-full max-w-6xl px-8 pb-12">
          <Link
            to="/careers"
            className="text-sm text-foreground-muted transition-colors hover:text-foreground"
          >
            &larr; Back to all openings
          </Link>
        </section>
      )}
    </div>
  )
}

export function CareersPage() {
  const { data, isLoading, error, retry } = useCareersContent()

  const groupedJobs = useMemo(() => {
    const groups = new Map<string, CareerJob[]>()

    for (const job of data?.jobs ?? []) {
      const existing = groups.get(job.department) ?? []
      existing.push(job)
      groups.set(job.department, existing)
    }

    return Array.from(groups.entries())
  }, [data])

  return (
    <CareersPageShell>
      {isLoading && <CareersLoadingState />}

      {!isLoading && error && <CareersErrorState message={error} retry={retry} />}

      {!isLoading && !error && data && (
        <div>
          <div className="sticky top-0 z-10 bg-white pt-20 pb-6 border-b border-border -mt-16">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-foreground-muted">
              Careers
            </p>
            <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
              Build the platform that lets others build.
            </h1>
            {hasRenderableContent(data.intro) && (
              <div
                className="blog-prose mt-4 text-sm"
                dangerouslySetInnerHTML={{
                  __html: renderContentToHtml(data.intro),
                }}
              />
            )}
            <h2 className="mt-8 text-2xl font-semibold text-foreground sm:text-3xl">
              Open Positions
            </h2>
          </div>

          <section className="mt-8">
            {data.jobs.length === 0 ? (
              <CareersEmptyState />
            ) : (
              <div className="space-y-10">
                {groupedJobs.map(([department, jobs]) => (
                  <section key={department}>
                    <h3 className="text-lg font-semibold text-foreground">
                      {department}
                    </h3>
                    <div className="mt-4 space-y-4">
                      {jobs.map((job) => {
                        const metadata = [
                          job.department,
                          job.location,
                          job.employmentType,
                          job.locationType,
                        ]
                          .filter(Boolean)
                          .join(" • ")

                        return (
                          <Link
                            key={job.id}
                            to={`/careers/${job.slug}`}
                            className="block rounded-2xl border border-border bg-surface p-6 transition-colors hover:border-border-hover hover:bg-surface-hover"
                          >
                            <h4 className="text-lg font-semibold text-foreground">
                              {job.title}
                            </h4>
                            <p className="mt-2 text-sm leading-relaxed text-foreground-muted">
                              {metadata}
                            </p>
                          </Link>
                        )
                      })}
                    </div>
                  </section>
                ))}
              </div>
            )}
          </section>
        </div>
      )}
    </CareersPageShell>
  )
}

export function CareerDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data, isLoading, error, retry } = useCareersContent()

  const job = data?.jobs.find((item) => item.slug === slug)

  return (
    <CareersPageShell showBackLink>
      {isLoading && <CareersLoadingState />}

      {!isLoading && error && <CareersErrorState message={error} retry={retry} />}

      {!isLoading && !error && !job && <CareersNotFoundState />}

      {!isLoading && !error && job && (
        <div>
          <div className="sticky top-0 z-10 bg-white pt-20 pb-6 border-b border-border -mt-16">
            <Link
              to="/careers"
              className="text-sm text-foreground-muted transition-colors hover:text-foreground"
            >
              &larr; All openings
            </Link>

            <header className="mt-4">
              <p className="text-sm font-medium uppercase tracking-[0.2em] text-foreground-muted">
                Careers
              </p>
              <h1 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
                {job.title}
              </h1>
              <div className="mt-4">
                <CareerMetadata job={job} />
              </div>
            </header>
          </div>

          <div className="mt-10 max-w-3xl space-y-12">
            {hasRenderableContent(data?.intro) && (
              <div
                className="blog-prose"
                dangerouslySetInnerHTML={{
                  __html: renderContentToHtml(data?.intro),
                }}
              />
            )}

            <RichTextSection
              title="Responsibilities"
              content={job.responsibilities}
            />
            <RichTextSection
              title="Qualifications"
              content={job.qualifications}
            />

            {hasRenderableContent(data?.closing) && (
              <section className="rounded-2xl border border-border bg-surface p-6">
                <div
                  className="blog-prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: renderContentToHtml(data?.closing),
                  }}
                />
              </section>
            )}
          </div>
        </div>
      )}
    </CareersPageShell>
  )
}
