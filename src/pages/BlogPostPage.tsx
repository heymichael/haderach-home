import { useParams, Link } from "react-router-dom"
import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { getPostBySlug } from "../lib/blog.ts"

export function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>()
  const post = slug ? getPostBySlug(slug) : undefined

  if (!post) {
    return (
      <div className="flex flex-1 items-center justify-center px-4 py-16">
        <p className="text-foreground-muted">Post not found.</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <article className="w-full max-w-6xl mx-auto px-8 pt-16 pb-20">
        <Link
          to="/blog"
          className="text-sm text-foreground-muted hover:text-foreground transition-colors"
        >
          &larr; All posts
        </Link>

        <header className="mt-8 mb-12">
          <time className="text-sm text-foreground-muted">
            {new Date(post.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </time>
          <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-foreground sm:text-4xl">
            {post.title}
          </h1>
          {post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-accent px-3 py-0.5 text-xs text-foreground-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="blog-prose max-w-3xl">
          <Markdown remarkPlugins={[remarkGfm]}>{post.content}</Markdown>
        </div>
      </article>
    </div>
  )
}
