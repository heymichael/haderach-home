export interface BlogPost {
  slug: string
  title: string
  date: string
  excerpt: string
  tags: string[]
  content: string
}

interface FrontMatter {
  title: string
  date: string
  slug: string
  excerpt: string
  tags: string[]
}

function parseFrontMatter(raw: string): { meta: FrontMatter; content: string } {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
  if (!match) {
    return {
      meta: { title: "", date: "", slug: "", excerpt: "", tags: [] },
      content: raw,
    }
  }

  const yaml = match[1]
  const content = match[2].trim()

  const get = (key: string): string => {
    const m = yaml.match(new RegExp(`^${key}:\\s*"?(.+?)"?\\s*$`, "m"))
    return m ? m[1] : ""
  }

  const tagsMatch = yaml.match(/^tags:\s*\[(.+)\]\s*$/m)
  const tags = tagsMatch
    ? tagsMatch[1].split(",").map((t) => t.trim().replace(/^"|"$/g, ""))
    : []

  return {
    meta: {
      title: get("title"),
      date: get("date"),
      slug: get("slug"),
      excerpt: get("excerpt"),
      tags,
    },
    content,
  }
}

const modules = import.meta.glob("../content/blog/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>

const posts: BlogPost[] = Object.values(modules)
  .map((raw) => {
    const { meta, content } = parseFrontMatter(raw)
    return { ...meta, content }
  })
  .filter((p) => p.slug && p.title)
  .sort((a, b) => b.date.localeCompare(a.date))

export function getAllPosts(): BlogPost[] {
  return posts
}

export function getPostBySlug(slug: string): BlogPost | undefined {
  return posts.find((p) => p.slug === slug)
}
