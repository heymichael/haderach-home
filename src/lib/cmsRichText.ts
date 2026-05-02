export type RichTextMark = {
  type?: string
  attrs?: Record<string, unknown>
}

export type RichTextNode = {
  type?: string
  text?: string
  content?: RichTextNode[]
  marks?: RichTextMark[]
  attrs?: Record<string, unknown>
}

export type ResolvedImageField = {
  asset_id: string
  resolved: boolean
  url?: string
  title?: string
  alt_text?: string
  width?: number
  height?: number
  approved_public?: boolean
  error?: string
}

export type RichTextValue = RichTextNode | string | null | undefined

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

function hasHtmlTag(value: string): boolean {
  return /<[^>]+>/.test(value)
}

function sanitizeHref(value: string): string {
  const trimmed = value.trim()

  if (
    trimmed.startsWith("/") ||
    trimmed.startsWith("#") ||
    trimmed.startsWith("mailto:") ||
    trimmed.startsWith("tel:")
  ) {
    return trimmed
  }

  try {
    const parsed = new URL(trimmed)
    if (parsed.protocol === "http:" || parsed.protocol === "https:") {
      return parsed.toString()
    }
  } catch {
    return "#"
  }

  return "#"
}

function renderChildren(node: RichTextNode): string {
  return (node.content ?? []).map(renderNode).join("")
}

function renderMarks(text: string, marks?: RichTextMark[]): string {
  return (marks ?? []).reduce((html, mark) => {
    switch (mark.type) {
      case "bold":
        return `<strong>${html}</strong>`
      case "italic":
        return `<em>${html}</em>`
      case "strike":
        return `<s>${html}</s>`
      case "code":
        return `<code>${html}</code>`
      case "underline":
        return `<u>${html}</u>`
      case "link": {
        const href =
          typeof mark.attrs?.href === "string"
            ? sanitizeHref(mark.attrs.href)
            : "#"
        const rel =
          typeof mark.attrs?.rel === "string"
            ? ` rel="${escapeHtml(mark.attrs.rel)}"`
            : ""
        const target =
          typeof mark.attrs?.target === "string"
            ? ` target="${escapeHtml(mark.attrs.target)}"`
            : ""
        const className =
          typeof mark.attrs?.class === "string"
            ? ` class="${escapeHtml(mark.attrs.class)}"`
            : ""

        return `<a href="${escapeHtml(href)}"${rel}${target}${className}>${html}</a>`
      }
      default:
        return html
    }
  }, text)
}

function renderNode(node: RichTextNode): string {
  if (node.type === "text") {
    return renderMarks(escapeHtml(node.text ?? ""), node.marks)
  }

  switch (node.type) {
    case "doc":
      return renderChildren(node)
    case "paragraph":
      return `<p>${renderChildren(node)}</p>`
    case "bulletList":
      return `<ul>${renderChildren(node)}</ul>`
    case "orderedList": {
      const start =
        typeof node.attrs?.start === "number" && node.attrs.start > 1
          ? ` start="${node.attrs.start}"`
          : ""
      return `<ol${start}>${renderChildren(node)}</ol>`
    }
    case "listItem":
      return `<li>${renderChildren(node)}</li>`
    case "heading": {
      const rawLevel =
        typeof node.attrs?.level === "number" ? node.attrs.level : 2
      const level = Math.min(6, Math.max(1, rawLevel))
      return `<h${level}>${renderChildren(node)}</h${level}>`
    }
    case "blockquote":
      return `<blockquote>${renderChildren(node)}</blockquote>`
    case "horizontalRule":
      return "<hr />"
    case "hardBreak":
      return "<br />"
    case "image": {
      const src =
        typeof node.attrs?.src === "string" ? sanitizeHref(node.attrs.src) : ""
      if (!src) return ""
      const alt =
        typeof node.attrs?.alt === "string" ? escapeHtml(node.attrs.alt) : ""
      const title =
        typeof node.attrs?.title === "string"
          ? ` title="${escapeHtml(node.attrs.title)}"`
          : ""
      const width =
        typeof node.attrs?.width === "number"
          ? ` width="${node.attrs.width}"`
          : ""
      const height =
        typeof node.attrs?.height === "number"
          ? ` height="${node.attrs.height}"`
          : ""
      return `<img src="${escapeHtml(src)}" alt="${alt}"${title}${width}${height} />`
    }
    default:
      return renderChildren(node)
  }
}

export function renderContentToHtml(value: RichTextValue): string {
  if (value == null) return ""

  if (typeof value === "string") {
    const trimmed = value.trim()
    if (!trimmed) return ""
    return hasHtmlTag(trimmed) ? trimmed : `<p>${escapeHtml(trimmed)}</p>`
  }

  return renderNode(value)
}

export function hasRenderableContent(value: RichTextValue): boolean {
  if (value == null) return false
  if (typeof value === "string") return value.trim().length > 0
  return renderContentToHtml(value).replace(/<[^>]+>/g, "").trim().length > 0
}

export function isResolvedImageField(value: unknown): value is ResolvedImageField {
  if (value == null || typeof value !== "object") return false
  const obj = value as Record<string, unknown>
  return typeof obj.asset_id === "string" && typeof obj.resolved === "boolean"
}

export function getImageFieldUrl(field: ResolvedImageField | unknown): string | null {
  if (!isResolvedImageField(field)) return null
  if (!field.resolved || !field.url) return null
  return field.url
}

export function getImageFieldAlt(field: ResolvedImageField | unknown): string {
  if (!isResolvedImageField(field)) return ""
  return field.alt_text ?? field.title ?? ""
}
