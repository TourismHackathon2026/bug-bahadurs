import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border/80 bg-surface/70 text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
        submitted: "border-border bg-muted/80 text-muted-foreground",
        review: "border-[oklch(0.79_0.07_190)] bg-[oklch(0.91_0.04_190)] text-[oklch(0.33_0.09_195)] dark:border-[oklch(0.5_0.07_190)] dark:bg-[oklch(0.28_0.045_190)] dark:text-[oklch(0.83_0.07_190)]",
        assigned: "border-[oklch(0.76_0.08_145)] bg-[oklch(0.91_0.045_145)] text-[oklch(0.33_0.09_145)] dark:border-[oklch(0.5_0.07_145)] dark:bg-[oklch(0.28_0.045_145)] dark:text-[oklch(0.84_0.07_145)]",
        investigation: "border-[oklch(0.76_0.08_275)] bg-[oklch(0.91_0.035_275)] text-[oklch(0.35_0.1_275)] dark:border-[oklch(0.5_0.07_275)] dark:bg-[oklch(0.28_0.045_275)] dark:text-[oklch(0.84_0.07_275)]",
        resolved: "border-[oklch(0.76_0.08_145)] bg-secondary text-secondary-foreground dark:border-[oklch(0.5_0.07_145)]",
        closed: "border-border bg-muted text-muted-foreground/75",
        priority: "bg-priority text-priority-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
