import Link from "next/link"
import { PlusCircle } from "@phosphor-icons/react/dist/ssr"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export function FeedComposerCTA() {
  return (
    <Card className="flex flex-col gap-4 border-border/70 bg-surface p-4 shadow-[0_18px_60px_oklch(0.29_0.012_96_/_0.08)] sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-foreground">What happened?</p>
        <p className="mt-1 text-sm text-muted-foreground">
          File a complaint with evidence, location, and status tracking.
        </p>
      </div>
      <Button asChild>
        <Link href="/complaints/new">
          <PlusCircle weight="bold" />
          File complaint
        </Link>
      </Button>
    </Card>
  )
}
