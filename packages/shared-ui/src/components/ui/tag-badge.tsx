import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../../lib/utils.ts"

const tagBadgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-accent text-accent-foreground",
        muted: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
)

function TagBadge({
  label,
  variant,
  className,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof tagBadgeVariants> & {
    label: string
  }) {
  return (
    <span
      data-slot="tag-badge"
      className={cn(tagBadgeVariants({ variant, className }))}
      {...props}
    >
      {label}
    </span>
  )
}

export { TagBadge, tagBadgeVariants }
