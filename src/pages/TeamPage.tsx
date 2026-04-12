export function TeamPage() {
  return (
    <div className="w-full">
      <section className="w-full max-w-6xl mx-auto px-8 pt-16 pb-20">
        <p className="text-sm font-medium uppercase tracking-widest text-foreground-muted mb-8">
          Team
        </p>

        <div className="flex flex-col items-start gap-8 sm:flex-row">
          <img
            src="/headshot_color_circle.png"
            alt="Michael Mader"
            className="h-28 w-28 shrink-0 rounded-full"
          />
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Michael Mader
            </h2>
            <p className="text-sm text-foreground-muted leading-relaxed max-w-3xl">
              Michael spent 12 years at Gap Inc., eventually as VP of Digital
              Marketing &amp; Transformation, where he built and ran a
              110-person global analytics organization. He went on to own the
              e-commerce platform end-to-end at Minted as VP Engineering &amp;
              Analytics, then stepped in as interim VP Product Management at
              Arcade.ai to shape an AI-enabled product strategy.               Michael values his personal connection to his team and is
              passionate about helping people grow and enabling them to leave
              positive change in their wake. He is a graduate of Williams
              College and the Stanford Graduate School of Business.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
