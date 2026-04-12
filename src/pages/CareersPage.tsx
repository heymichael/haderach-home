import { Link } from "react-router-dom"

export function CareersPage() {
  return (
    <div className="w-full">
      <section className="w-full max-w-6xl mx-auto px-8 pt-16 pb-16">
        <p className="text-sm font-medium uppercase tracking-widest text-foreground-muted mb-4">
          Careers
        </p>
        <h1 className="text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
          Build the platform that lets others build.
        </h1>
        <p className="mt-6 text-base leading-relaxed text-foreground-muted max-w-3xl">
          We're not building tools. We're building the platform that lets
          front-line strategists and operators build the tools they want. When
          something doesn't work the way they need, it should be easy for them
          to change it. We're pre-seed, building with real users, and looking
          for people who want to shape something from the ground up.
        </p>
      </section>

      <section className="w-full max-w-6xl mx-auto px-8 pb-20">
        <h2 className="text-2xl font-semibold text-foreground mb-8">
          Why join now
        </h2>
        <div className="space-y-6 text-sm text-foreground-muted leading-relaxed max-w-3xl">
          <p>
            This is founding-team territory. The architecture is real, the pilot
            client is live, and enterprise buyers are reaching out. But we're
            still small enough that every person shapes the product, the culture,
            and the company direction.
          </p>
          <p>
            We build in the open. Strategy conversations are shared as raw
            transcripts, not polished decks. Merit is recognized on results, not
            gatekept by hierarchy. If you've worked at a company where politics
            outweighed signal, this is the antidote.
          </p>
          <p>
            The technical work is genuinely interesting. Modular agent
            architectures, stochastic testing frameworks for nondeterministic AI,
            trust maturity models for human-AI collaboration, cost-annotated
            integration libraries. This isn't a chatbot bolted onto a database —
            it's a new way of building software.
          </p>
        </div>
      </section>

      <section className="w-full max-w-6xl mx-auto px-8 pb-20">
        <h2 className="text-2xl font-semibold text-foreground mb-8">
          What we value
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              User sovereignty
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Every tool should work exactly as the user wants. And if it
              doesn't, it should be easy for them to change it.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              Cost-first mindset
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              We scour the earth to make sure our clients have access to and are
              utilizing the lowest cost models that suit their purposes. Our
              interests stay firmly aligned with our users.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              Joy in the work
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              We want work to be joyous. We want people to feel proud of what
              they're leaving behind — not just at our company but at our
              clients. We foster community because better outcomes come from
              people who genuinely care about each other's success.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              Aligned economics
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              We want to be paid fairly for the value we deliver. Cost-plus
              pricing isn't just for customers — it's a principle. We don't hide
              costs, complexity, or tradeoffs. We never use what we know to hold
              clients hostage to solutions that don't serve their interest in
              every way.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full max-w-6xl mx-auto px-8 pb-20">
        <h2 className="text-2xl font-semibold text-foreground mb-4">
          Open roles
        </h2>
        <p className="text-sm text-foreground-muted leading-relaxed mb-8 max-w-3xl">
          We're actively building the founding team. If the work described above
          resonates, reach out — even if you don't see your exact role listed.
          At this stage, the right person matters more than the right title.
        </p>
        <div className="space-y-6">
          <div className="rounded-xl border border-border p-6">
            <h3 className="text-base font-semibold text-foreground mb-1">
              Director of Infrastructure &amp; Security
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Own the platform's infrastructure, CI/CD, cloud architecture, and
              security posture end-to-end. Lead SOC 2 readiness, define the
              multi-tenant isolation model, and build the deployment pipeline
              that lets us ship with confidence. You'll set the standard for how
              we operate in production — monitoring, incident response, cost
              management, and the security practices that earn enterprise trust.
              Deep GCP or AWS experience, strong opinions on infrastructure as
              code, and a track record of building secure systems from early
              stage through scale.
            </p>
          </div>
          <div className="rounded-xl border border-border p-6">
            <h3 className="text-base font-semibold text-foreground mb-1">
              Director of Finance &amp; Administration
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Stand up and run the financial and administrative backbone of an
              early-stage company. Own financial planning, bookkeeping, cash
              management, fundraising operations, and compliance. Build the
              cost-plus billing model that is central to our value proposition —
              making sure we can track, attribute, and transparently pass
              through costs at every layer. You'll also handle corporate
              governance, benefits, and the operational details that let
              everyone else focus on building. Startup finance experience
              preferred; comfort with ambiguity required.
            </p>
          </div>
          <div className="rounded-xl border border-border p-6">
            <h3 className="text-base font-semibold text-foreground mb-1">
              Senior Back-End Engineer
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Build the agent service, tool framework, and API layer that powers
              the platform. You'll work on modular prompt composition, stochastic
              LLM testing, Postgres data models, and the integration connectors
              that link the platform to external systems. Python, FastAPI, and
              PostgreSQL are the core stack. Experience with LLM APIs, streaming
              responses, and building reliable services that handle
              nondeterministic behavior. You should care about clean contracts,
              testability, and building systems that practitioners can trust.
            </p>
          </div>
          <div className="rounded-xl border border-border p-6">
            <h3 className="text-base font-semibold text-foreground mb-1">
              Senior Front-End Engineer
            </h3>
            <p className="text-sm text-foreground-muted leading-relaxed">
              Own the user experience across the platform — the domain apps,
              shared component library, chat interfaces, and the tools that
              practitioners interact with daily. React, TypeScript, and Tailwind
              CSS are the foundation. You'll build interfaces that are clean,
              fast, and composable — designed so that new domain tools can be
              assembled from proven components without starting from scratch.
              Strong opinions on component architecture, accessibility, and
              building UIs that feel good to use. Experience with real-time data,
              streaming, and design systems is a plus.
            </p>
          </div>
        </div>
      </section>

      <section className="w-full max-w-6xl mx-auto px-8 pb-20">
        <div className="rounded-xl border border-border p-6 text-center">
          <p className="text-sm text-foreground-muted">
            Interested? Contact{" "}
            <a
              href="mailto:support@haderach.ai"
              className="font-medium text-foreground underline underline-offset-4 hover:text-primary"
            >
              support@haderach.ai
            </a>
          </p>
        </div>
      </section>

      <section className="w-full max-w-6xl mx-auto px-8 pb-12">
        <Link
          to="/"
          className="text-sm text-foreground-muted hover:text-foreground transition-colors"
        >
          &larr; Back to home
        </Link>
      </section>
    </div>
  )
}
