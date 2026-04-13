function Section({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={`w-full max-w-6xl mx-auto px-8 ${className}`}>
      {children}
    </section>
  )
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-sm font-medium uppercase tracking-widest text-foreground-muted">
      {children}
    </p>
  )
}

const PILLARS = [
  {
    title: "Unified visibility",
    copy:
      "Bring SaaS and cloud billing into one place across APIs, exports, admin surfaces, and invoice workflows.",
  },
  {
    title: "Agent interface",
    copy:
      "Ask questions the dashboard was never designed to answer, even when the important cut of the data only becomes obvious later.",
  },
  {
    title: "Fine-grained permissioning",
    copy:
      "Give more people access to spend intelligence without giving everyone access to everything.",
  },
]

const ROLES = [
  {
    title: "Finance",
    copy:
      "See cost creep early, compare vendors consistently, and work from a shared picture of spend instead of one-off reconciliations.",
  },
  {
    title: "IT",
    copy:
      "Track the tools already in use, understand where billing data comes from, and control access at the system and team level.",
  },
  {
    title: "Operations",
    copy:
      "Use spend as an operating signal, not just an accounting output, and follow up on changes before they become budget surprises.",
  },
  {
    title: "Department owners",
    copy:
      "Get visibility into the tools your team relies on, ask your own questions, and stay inside the data you are actually allowed to see.",
  },
]

const SOURCE_ROWS = [
  {
    provider: "AWS",
    interface: "API-based",
    ingest:
      "Cost and usage data through AWS billing and cost APIs.",
  },
  {
    provider: "Google Cloud",
    interface: "Export / query-based",
    ingest: "Billing exports through BigQuery.",
  },
  {
    provider: "Azure",
    interface: "API-based",
    ingest: "Cost and usage data through Azure Cost Management APIs.",
  },
  {
    provider: "OpenAI",
    interface: "API-based",
    ingest: "Usage and cost data through API-accessible billing endpoints.",
  },
  {
    provider: "Anthropic",
    interface: "API-based",
    ingest: "Organization-level usage and cost data.",
  },
  {
    provider: "Vercel",
    interface: "API-based",
    ingest: "Usage and billing data through API-accessible billing endpoints.",
  },
  {
    provider: "Datadog",
    interface: "API-based",
    ingest: "Billable usage and cost data.",
  },
  {
    provider: "GitHub",
    interface: "API-based",
    ingest: "Organization billing and usage data.",
  },
  {
    provider: "Snowflake",
    interface: "Export / query-based",
    ingest: "Cost and usage data through account usage views.",
  },
  {
    provider: "Slack",
    interface: "Admin / seat-derived",
    ingest: "Billable-member and plan data.",
  },
  {
    provider: "Cursor",
    interface: "Admin / seat-derived",
    ingest: "Team usage and billing-adjacent admin data.",
  },
  {
    provider: "Atlassian",
    interface: "Invoice / dashboard-based",
    ingest: "Billing statements and invoice-driven workflows.",
  },
  {
    provider: "Notion",
    interface: "Invoice / dashboard-based",
    ingest: "Seat-based billing and invoice workflows.",
  },
  {
    provider: "Figma",
    interface: "Invoice / dashboard-based",
    ingest: "Seat-based billing and invoice workflows.",
  },
]

const PROMPTS = [
  "Why did OpenAI spend jump last month?",
  "Which tools are growing fastest across the teams I manage?",
  "Show me spend by department, but only for the systems my role can access.",
  "Which vendors still require invoice workflows instead of direct integrations?",
  "What changed this month that the dashboard was not designed to surface?",
]

const HOW_IT_WORKS = [
  "Connect API-backed sources where direct billing interfaces exist.",
  "Configure export or query-backed systems such as billing datasets and usage views.",
  "Route invoice- and dashboard-based vendors through controlled email or statement workflows.",
  "Set access rules so Finance, IT, Operations, and department owners see the right slice of the data.",
  "Use the dashboard for the common questions and the agent for everything else.",
]

const TRUST_ITEMS = [
  {
    title: "Delegated access where supported",
    copy:
      "Use OAuth and provider-native access paths where they exist, rather than collecting broad credentials by default.",
  },
  {
    title: "Controlled data movement",
    copy:
      "Protect data in transit and at rest while handling APIs, exports, and invoice workflows through explicit ingestion paths.",
  },
  {
    title: "Tenant isolation and role-based access",
    copy:
      "Keep access scoped at the server side so teams can collaborate without accidental overexposure of sensitive billing data.",
  },
  {
    title: "Auditability",
    copy:
      "Preserve the raw source path where it matters so teams can drill back to the underlying records with confidence.",
  },
]

export function SaasBillingVisibilityPage() {
  return (
    <div className="w-full">
      <section className="w-full max-w-6xl mx-auto px-8 pt-16 pb-16">
        <p className="mb-4 text-sm font-medium uppercase tracking-widest text-foreground-muted">
          Product
        </p>
        <div>
          <h1 className="text-3xl font-semibold leading-snug tracking-tight text-foreground sm:text-4xl">
            See every SaaS charge in one place.
          </h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-foreground-muted">
            SaaS and cloud billing data is scattered across APIs, exports,
            invoices, and admin dashboards. Haderach brings those sources into
            one shared operating surface so Finance, IT, Operations, and
            department owners can work from the same facts, then ask the next
            question when the dashboard is not enough.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-foreground-muted">
            Start with a shared dashboard. Go deeper with the agent. Open access
            up safely with fine-grained permissions. The result is not just
            better reporting - it is faster coordination around what your tools
            are costing you and why.
          </p>
        </div>
      </section>

      <Section className="pb-20">
        <SectionLabel>Core pillars</SectionLabel>
        <div className="grid gap-6 sm:grid-cols-3">
          {PILLARS.map((pillar) => (
            <div key={pillar.title} className="rounded-xl border border-border p-6">
              <h2 className="mb-2 text-base font-semibold text-foreground">
                {pillar.title}
              </h2>
              <p className="text-sm leading-relaxed text-foreground-muted">
                {pillar.copy}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="pb-20">
        <SectionLabel>Across the organization</SectionLabel>
        <h2 className="mb-10 text-2xl font-semibold tracking-tight text-foreground">
          Shared visibility for Finance, IT, Operations, and department owners.
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {ROLES.map((role) => (
            <div key={role.title} className="rounded-xl border border-border p-6">
              <h3 className="mb-2 text-base font-semibold text-foreground">
                {role.title}
              </h3>
              <p className="text-sm leading-relaxed text-foreground-muted">
                {role.copy}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="pb-20">
        <SectionLabel>How we connect to your spend data</SectionLabel>
        <p className="mb-8 max-w-3xl text-sm leading-relaxed text-foreground-muted">
          Every provider exposes billing differently. Some offer direct APIs,
          some expose exports or queryable billing datasets, and others require
          invoice- or admin-based workflows. We support all three patterns so
          you can build a complete picture without waiting for vendors to
          standardize.
        </p>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="min-w-full border-collapse text-left">
            <thead className="bg-muted">
              <tr>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-foreground-muted">
                  Provider
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-foreground-muted">
                  Interface
                </th>
                <th className="px-4 py-3 text-xs font-medium uppercase tracking-widest text-foreground-muted">
                  What we ingest
                </th>
              </tr>
            </thead>
            <tbody>
              {SOURCE_ROWS.map((row, index) => (
                <tr
                  key={row.provider}
                  className={index < SOURCE_ROWS.length - 1 ? "border-t border-border" : ""}
                >
                  <td className="px-4 py-4 text-sm font-medium text-foreground">
                    {row.provider}
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground-muted">
                    {row.interface}
                  </td>
                  <td className="px-4 py-4 text-sm text-foreground-muted">
                    {row.ingest}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section className="pb-20">
        <SectionLabel>Ask new questions</SectionLabel>
        <div className="grid gap-8 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <h2 className="mb-4 text-2xl font-semibold tracking-tight text-foreground">
              Ask questions the dashboard was never designed to answer.
            </h2>
            <p className="max-w-2xl text-sm leading-relaxed text-foreground-muted">
              Spend data is multidimensional. The question that matters often
              shows up after the dashboard is built. The agent interface gives
              teams a way to keep exploring without waiting for a custom report,
              while server-side permissioning keeps the answers aligned to each
              person's actual access.
            </p>
          </div>
          <div className="rounded-xl border border-border p-6">
            <p className="mb-4 text-sm font-semibold text-foreground">
              Example prompts
            </p>
            <div className="space-y-3">
              {PROMPTS.map((prompt) => (
                <div
                  key={prompt}
                  className="rounded-lg bg-muted px-4 py-3 text-sm text-foreground"
                >
                  {prompt}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section className="pb-20">
        <SectionLabel>How it works</SectionLabel>
        <div className="grid gap-4">
          {HOW_IT_WORKS.map((step, index) => (
            <div
              key={step}
              className="grid gap-4 rounded-xl border border-border p-5 sm:grid-cols-[40px_minmax(0,1fr)] sm:items-start"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
                {index + 1}
              </div>
              <p className="pt-2 text-sm leading-relaxed text-foreground-muted sm:pt-1">
                {step}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="pb-20">
        <SectionLabel>Trust and control</SectionLabel>
        <h2 className="mb-10 text-2xl font-semibold tracking-tight text-foreground">
          Built for sensitive spend data without turning into a compliance page.
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          {TRUST_ITEMS.map((item) => (
            <div key={item.title} className="rounded-xl border border-border p-6">
              <h3 className="mb-2 text-base font-semibold text-foreground">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-foreground-muted">
                {item.copy}
              </p>
            </div>
          ))}
        </div>
      </Section>

      <Section className="pb-20">
        <div className="rounded-2xl border border-border bg-surface p-8 text-center">
          <h2 className="text-2xl font-semibold tracking-tight text-foreground">
            Bring spend visibility into the workflow, not just the monthly review.
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-relaxed text-foreground-muted">
            Start with a shared dashboard. Go deeper with the agent. Open access
            up safely with fine-grained permissions. The result is not just
            better reporting - it is faster coordination around what your tools
            are costing you and why.
          </p>
          <div className="mt-8">
            <a
              href="mailto:support@haderach.ai?subject=Talk%20to%20us%20about%20SaaS%20billing%20visibility"
              className="inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
            >
              Talk to us
            </a>
          </div>
        </div>
      </Section>
    </div>
  )
}
