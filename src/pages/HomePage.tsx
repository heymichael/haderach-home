function Section({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode
  className?: string
  id?: string
}) {
  return (
    <section id={id} className={`w-full max-w-6xl mx-auto px-8 ${className}`}>
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

export function HomePage() {
  return (
    <div className="w-full">
      {/* Hero */}
      <section className="w-full max-w-6xl mx-auto px-8 pt-16 pb-16">
        <div className="grid gap-12 sm:grid-cols-2 items-start">
          <h1 className="text-3xl font-semibold leading-snug tracking-tight text-foreground sm:text-4xl">
            The agent-native operating layer for business.
          </h1>
          <p className="text-base leading-relaxed text-foreground-muted sm:pt-1">
            The bottleneck to change is no longer code — it's strategic
            thinking. Our AI-native platform lets domain experts and
            front-line operators use conversation and community to shape the
            tools and AI agents around the process they want. The code becomes an artifact.
          </p>
        </div>
      </section>

      {/* Value Propositions */}
      <section className="w-full max-w-6xl mx-auto px-8 pb-20">
        <div className="grid gap-6 sm:grid-cols-4">
          <div className="rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Practitioner empowerment
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Frontline practitioners shape the platform through strategic
              conversations, without ever touching code. Their domain expertise
              steers what gets built.
            </p>
          </div>
          <div className="rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Transformation consulting
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              We teach your teams to use, adapt or build tools from scratch,
              and how to build, test, and monitor agents.
            </p>
          </div>
          <div className="rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Cost-plus transparency
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              No plans, bundles, or seat limits. Use what's there, build what's
              missing — then pay cost-plus for what you actually use.
            </p>
          </div>
          <div className="rounded-xl border border-border p-5">
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Community
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Collaborate directly across an industry on common process — not
              orchestrated by a vendor. More participants, better platform,
              lower costs for all.
            </p>
          </div>
        </div>
      </section>

      {/* Technology */}
      <Section className="pb-20">
        <SectionLabel>Technology</SectionLabel>
        <div className="space-y-10">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Modular agent architecture
            </h3>
            <p className="text-foreground-muted leading-relaxed max-w-2xl">
              The agent's intelligence is composed dynamically from UI context.
              Each interface declares the tools it accepts; the backend assembles
              the right capabilities. No monolithic prompts, no fragile
              conditional logic — just clean, testable composition.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Stochastic LLM testing
            </h3>
            <p className="text-foreground-muted leading-relaxed max-w-2xl">
              LLM agents are nondeterministic — a test that passes 85% of the
              time looks identical to one that passes 100% on any given run. Our
              framework quantifies which capabilities work, how reliably, and at
              what cost, using multi-run stochastic testing with capability
              tagging.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Trust maturity ladder
            </h3>
            <p className="text-foreground-muted leading-relaxed max-w-2xl">
              Trust in data correctness is earned, not declared. A maturity
              ladder from human-verified spreadsheets to agent-proposed workflows
              to system-verified operations with guardrails. The agent works
              alongside people, earning trust through reps at each stage.
            </p>
          </div>
        </div>
      </Section>

      {/* Enterprise Readiness */}
      <Section className="pb-20">
        <SectionLabel>Enterprise ready</SectionLabel>
        <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-10">
          Production-grade from day one.
        </h2>
        <div className="grid gap-6 sm:grid-cols-4">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">
              SOC 2 path
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Security and compliance architecture designed for SOC 2
              certification from the start, not bolted on later.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">
              SSO path
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Enterprise single sign-on support so organizations can manage
              access through their existing identity provider.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Multi-tenancy
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Isolated tenant data, scoped permissions, and role-based access
              control built into the core architecture.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-2">
              Living integration library
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Plug-and-play API connectors with cost annotations and roadmap
              visibility — integrations that stay current, not stale.
            </p>
          </div>
        </div>
      </Section>

      <div className="pb-8" />
    </div>
  )
}
