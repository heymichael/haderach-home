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
    <p className="text-sm font-medium uppercase tracking-widest text-foreground-muted mb-4">
      {children}
    </p>
  )
}

export function InvestorsPage() {
  return (
    <div className="w-full">
      <section className="w-full max-w-6xl mx-auto px-8 pt-16 pb-16">
        <p className="text-sm font-medium uppercase tracking-widest text-foreground-muted mb-4">
          Investors
        </p>
        <h1 className="text-3xl font-semibold leading-snug tracking-tight text-foreground sm:text-4xl">
          Where we are and where we're going.
        </h1>
      </section>

      {/* Traction */}
      <Section className="pb-20">
        <SectionLabel>Traction</SectionLabel>
        <div className="space-y-4">
          <div className="rounded-xl border border-border p-6 flex gap-6">
            <span className="text-sm font-semibold text-foreground shrink-0 w-56">
              Arcade
            </span>
            <span className="text-sm text-foreground-muted leading-relaxed">
              Live pilot. Vendor management, spend analytics, multi-party
              integration workflows.
            </span>
          </div>
          <div className="rounded-xl border border-border p-6 flex gap-6">
            <span className="text-sm font-semibold text-foreground shrink-0 w-56">
              Kontoor Brands / Helly Hansen
            </span>
            <span className="text-sm text-foreground-muted leading-relaxed">
              Executive-level prospect interest via Marion Thomas, VP Strategy
              &amp; Operations. Incumbent vendors delivering "weak, AI-light
              demos" — our approach "seems radical and might be the solution
              we're looking for." Introductory meeting on April 24.
            </span>
          </div>
        </div>
      </Section>

      {/* Product Roadmap */}
      <Section className="pb-20">
        <SectionLabel>Product roadmap</SectionLabel>
        <div className="space-y-8">
          <div className="rounded-xl border border-border p-6">
            <p className="text-xs font-medium uppercase tracking-widest text-foreground-muted mb-2">
              Initial GTM
            </p>
            <h3 className="text-base font-semibold text-foreground mb-2">
              SaaS spending visibility
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed max-w-3xl">
              We connect to every SaaS spending API — some like Amazon are
              flexible, some are nightmarish wades through BigQuery dumps, some
              require parsing the invoice to extract the detail you need. We
              handle it all. Customers pay for the server charges when
              they ping a report.
            </p>
            <div className="mt-4 space-y-1.5 text-sm text-foreground-muted">
              <p>
                <span className="font-medium text-foreground">Real pain point.</span>{" "}
                SaaS charges creep up silently. This solves a problem everyone
                feels but nobody has a clean answer for.
              </p>
              <p>
                <span className="font-medium text-foreground">Reinforces the value prop.</span>{" "}
                Let them actually see what's going on. Transparency in action.
              </p>
              <p>
                <span className="font-medium text-foreground">Makes finance our ally.</span>{" "}
                The CFO's office becomes an internal champion for the platform.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-border p-6">
            <p className="text-xs font-medium uppercase tracking-widest text-foreground-muted mb-2">
              Hard but strategic
            </p>
            <h3 className="text-base font-semibold text-foreground mb-2">
              HR systems &amp; the org model
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed max-w-3xl">
              HR systems — in particular those where we own the org model.
              Coupled with rich usage data that maps to organizations, we learn
              how work actually gets done within and across companies. Our models
              get better continuously. The community aspect encourages
              participation and sharing — even if individual organizations turn
              off data sharing, we still get strong signal from the network effect.
            </p>
          </div>

          <div className="rounded-xl border border-border p-6">
            <p className="text-xs font-medium uppercase tracking-widest text-foreground-muted mb-2">
              Long-term moat
            </p>
            <h3 className="text-base font-semibold text-foreground mb-2">
              Product &amp; strategy tools
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed max-w-3xl">
              An intake pipeline and transcript-first set of tools, orchestrated
              by state handlers that triage and reconcile data from
              conversations, meetings, and external inputs. Currently a
              single-user repo-level implementation that needs to move into
              multi-user mode. The community will interact with these tools, but
              the tools themselves are not exposed — they drive transformation
              internally and create compounding advantage.
            </p>
          </div>

          <div className="rounded-xl border border-border p-6">
            <p className="text-xs font-medium uppercase tracking-widest text-foreground-muted mb-2">
              In progress
            </p>
            <h3 className="text-base font-semibold text-foreground mb-2">
              Vendor landscape scrape &amp; catalog
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed max-w-3xl">
              Scraping and cataloging SaaS companies, their offerings, pricing
              models, and where possible their customer badges. This feeds
              directly into product planning. Vendors are likely to start hiding
              this content — we need to capture it now while it's available.
            </p>
          </div>
        </div>
      </Section>

      {/* What we need */}
      <Section className="pb-20">
        <SectionLabel>What we need</SectionLabel>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-10">
          What we need.
        </h2>
        <div className="space-y-8 max-w-3xl">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Front-end and back-end engineering talent
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Senior engineers to drive a fully composable platform. The
              architecture is defined — we need people who can build it.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Director of Infrastructure &amp; Security
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Critical path. SOC 2 certification has fixed timelines and we need
              to get going immediately. This hire and the associated process
              costs are urgent.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Pre-seed capital
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Funding to extend runway through first enterprise contracts.
              Architecture is built, pilot is live, enterprise interest is warm —
              capital accelerates the go-to-market motion.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Strategic introductions
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Connections to operations leaders — mid-market or enterprise — who
              feel the pain of rigid SaaS and are open to a fundamentally
              different model. Enterprise engagements that start with consulting
              are especially valuable as a major source of near-term revenue.
            </p>
          </div>
        </div>
      </Section>

      <div className="pb-8" />
    </div>
  )
}
