import { Link } from "react-router-dom"
import { getAllPosts } from "../lib/blog.ts"

export function BlogIndexPage() {
  const posts = getAllPosts()

  return (
    <div className="w-full">
      <section className="w-full max-w-6xl mx-auto px-8 pt-16 pb-12">
        <p className="text-sm font-medium uppercase tracking-widest text-foreground-muted mb-4">
          Blog
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
          Thinking out loud.
        </h1>
        <p className="mt-4 text-base text-foreground-muted">
          Strategy, architecture, and the ideas behind the platform — shared as
          raw thinking, not polished marketing.
        </p>
      </section>

      <section className="w-full max-w-6xl mx-auto px-8 pb-12">
        {posts.length === 0 ? (
          <p className="text-foreground-muted">No posts yet.</p>
        ) : (
          <div className="space-y-8">
            {posts.map((post) => (
              <article key={post.slug}>
                <Link to={`/blog/${post.slug}`} className="group block">
                  <time className="text-sm text-foreground-muted">
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <h2 className="mt-1 text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-2 text-sm text-foreground-muted leading-relaxed">
                    {post.excerpt}
                  </p>
                </Link>
              </article>
            ))}
          </div>
        )}
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
