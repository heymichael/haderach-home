const LEGAL_DOCS: Record<string, { title: string; url: string }> = {
  privacy: {
    title: "Privacy Policy",
    url: "https://app.termly.io/policy-viewer/policy.html?policyUUID=6657c7d7-1d24-435e-bccf-9e42f2dd798f",
  },
  terms: {
    title: "Terms & Conditions",
    url: "https://app.termly.io/policy-viewer/policy.html?policyUUID=bb32fe76-4bd7-4315-abf2-e0df4c74a0f7",
  },
  eula: {
    title: "End-User License Agreement",
    url: "https://app.termly.io/policy-viewer/policy.html?policyUUID=8bb73926-d6e4-4c07-b1b8-6d01be44710d",
  },
}

function getLegalDoc(slug: string) {
  return LEGAL_DOCS[slug] ?? null
}

export function LegalPage({ slug }: { slug: string }) {
  const doc = getLegalDoc(slug)

  if (!doc) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <p className="text-foreground-muted">Page not found.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col w-full max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-foreground mb-6">{doc.title}</h1>
      <iframe
        src={doc.url}
        title={doc.title}
        className="flex-1 w-full rounded-lg border border-border"
        style={{ minHeight: "80vh" }}
      />
    </div>
  )
}
