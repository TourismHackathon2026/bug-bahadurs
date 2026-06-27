import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "group/badge inline-flex h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-md border border-transparent px-2.5 py-0.5 text-xs font-medium whitespace-nowrap transition-all focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 has-data-[icon=inline-end]:pr-1.5 has-data-[icon=inline-start]:pl-1.5 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a]:hover:bg-primary/80",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        destructive:
          "bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40 [a]:hover:bg-destructive/20",
        outline:
          "border-border text-foreground [a]:hover:bg-muted [a]:hover:text-muted-foreground",
        ghost:
          "hover:bg-muted hover:text-muted-foreground dark:hover:bg-muted/50",
        link: "text-primary underline-offset-4 hover:underline",
        submitted: "border-border bg-muted text-muted-foreground",
        review: "border-[oklch(0.8_0.045_82)] bg-[oklch(0.94_0.025_82)] text-[oklch(0.38_0.04_76)] dark:border-[oklch(0.48_0.045_82)] dark:bg-[oklch(0.32_0.03_82)] dark:text-[oklch(0.84_0.045_82)]",
        assigned: "border-[oklch(0.78_0.035_132)] bg-[oklch(0.93_0.02_132)] text-[oklch(0.34_0.04_132)] dark:border-[oklch(0.48_0.04_132)] dark:bg-[oklch(0.31_0.026_132)] dark:text-[oklch(0.82_0.045_132)]",
        investigation: "border-[oklch(0.76_0.035_318)] bg-[oklch(0.92_0.018_318)] text-[oklch(0.35_0.04_318)] dark:border-[oklch(0.48_0.04_318)] dark:bg-[oklch(0.31_0.025_318)] dark:text-[oklch(0.82_0.04_318)]",
        resolved: "border-[oklch(0.77_0.04_132)] bg-secondary text-secondary-foreground dark:border-[oklch(0.5_0.045_132)]",
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
