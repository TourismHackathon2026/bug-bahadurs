import { FilePlus, FolderOpen, ShieldCheck, WarningCircle } from "@phosphor-icons/react/dist/ssr"

import { ComplaintCard } from "@/components/complaint/complaint-card"
import { ComplaintFeedSkeleton } from "@/components/complaint/complaint-feed-skeleton"
import { FeedComposerCTA } from "@/components/complaint/feed-composer-cta"
import { FeedFilterBar } from "@/components/complaint/feed-filter-bar"
import { StatusTimeline } from "@/components/complaint/status-timeline"
import { Navbar } from "@/components/layout/navbar"
import { PageShell } from "@/components/layout/page-shell"
import { EmptyState } from "@/components/ui/empty-state"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { PriorityBadge } from "@/components/ui/priority-badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/ui/status-badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

const sampleComplaint = {
  id: "sample",
  reference: "AWA-2026-0142",
  title: "Taxi overcharged after airport pickup",
  description:
    "The driver changed the fare twice after leaving the terminal and refused to provide a receipt when asked.",
  category: "Taxi fraud",
  status: "INVESTIGATION" as const,
  priority: "HIGH" as const,
  lastUpdated: "12 min ago",
  evidenceCount: 3,
  responsePreview:
    "Traffic Police has reviewed the receipt image and requested the taxi plate number for verification.",
}

export default function Home() {
  return (
    <>
      <Navbar />
      <PageShell>
        <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            <div className="rounded-lg border border-border/70 bg-surface p-5 shadow-[0_18px_60px_oklch(0.29_0.012_96_/_0.08)]">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <Badge variant="secondary">Design system foundation</Badge>
                  <h1 className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
                    Calm civic UI for complaint filing, tracking, and authority response.
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                    Awaaz uses shadcn primitives with a graphite and moss palette, warm stone
                    surfaces, clay priority states, compact feed ergonomics, and visible accessibility
                    states.
                  </p>
                </div>
                <Button>
                  <FilePlus weight="bold" />
                  File complaint
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {[
                ["Open complaints", "12", ShieldCheck],
                ["Needs evidence", "03", WarningCircle],
                ["Resolved this month", "28", FolderOpen],
              ].map(([label, value, Icon]) => (
                <Card key={label as string} className="bg-surface">
                  <CardContent className="flex items-center justify-between p-5">
                    <div>
                      <p className="text-sm text-muted-foreground">{label as string}</p>
                      <p className="mt-2 text-3xl font-semibold tracking-tight">{value as string}</p>
                    </div>
                    <div className="flex size-10 items-center justify-center rounded-md border border-primary/15 bg-secondary text-primary">
                      <Icon size={20} weight="duotone" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <FeedComposerCTA />
            <FeedFilterBar activeFilters={["Investigation", "High priority", "Taxi fraud"]} />
            <ComplaintCard {...sampleComplaint} />
          </div>

          <aside className="space-y-6">
            <Card className="bg-surface">
              <CardHeader>
                <CardTitle>Tokens</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  <div className="h-12 rounded-md border border-border bg-primary" />
                  <div className="h-12 rounded-md border border-border bg-background" />
                  <div className="h-12 rounded-md border border-border bg-priority" />
                  <div className="h-12 rounded-md border border-border bg-secondary" />
                </div>
                <Separator />
                <div className="flex flex-wrap gap-2">
                  <StatusBadge status="SUBMITTED" />
                  <StatusBadge status="UNDER_REVIEW" />
                  <StatusBadge status="ASSIGNED" />
                  <StatusBadge status="INVESTIGATION" />
                  <StatusBadge status="RESOLVED" />
                  <PriorityBadge priority="URGENT" />
                </div>
              </CardContent>
            </Card>

            <StatusTimeline
              currentStatus="INVESTIGATION"
              reachedAt={{
                SUBMITTED: "Jun 24, 2026",
                UNDER_REVIEW: "Jun 25, 2026",
                ASSIGNED: "Jun 26, 2026",
              }}
            />

            <Card className="bg-surface">
              <CardHeader>
                <CardTitle>Form states</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Input placeholder="Complaint title" />
                <Textarea placeholder="Describe what happened" />
                <Progress value={62} />
                <div className="flex gap-2">
                  <Button size="sm">Submit</Button>
                  <Button size="sm" variant="outline">
                    Save draft
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>
        </section>

        <section className="mt-8 grid gap-6 lg:grid-cols-2">
          <Tabs defaultValue="loading" className="rounded-lg border bg-surface p-4">
            <TabsList>
              <TabsTrigger value="loading">Loading</TabsTrigger>
              <TabsTrigger value="empty">Empty</TabsTrigger>
            </TabsList>
            <TabsContent value="loading" className="mt-4">
              <ComplaintFeedSkeleton />
            </TabsContent>
            <TabsContent value="empty" className="mt-4">
              <EmptyState
                icon={FolderOpen}
                title="No complaints match these filters"
                description="Clear filters or adjust the date range to widen the feed."
                actionLabel="Clear filters"
              />
            </TabsContent>
          </Tabs>

          <Card className="bg-surface">
            <CardHeader>
              <CardTitle>Design rules encoded</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 text-sm leading-6 text-muted-foreground">
              <p>All data surfaces account for loading, empty, and error-ready composition.</p>
              <p>Status and priority colors are centralized through constants and semantic badges.</p>
              <p>Feed controls stay sticky and visible, with active filters shown as removable chips.</p>
              <p>Reference numbers use mono type, while the main interface stays readable sans-serif.</p>
            </CardContent>
          </Card>
        </section>
      </PageShell>
    </>
  )
}
