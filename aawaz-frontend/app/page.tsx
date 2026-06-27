import Link from "next/link";
import {
  CheckCircle,
  GlobeHemisphereWest,
  MapPin,
  ShieldCheck,
  Sparkle,
  UsersThree,
} from "@phosphor-icons/react/dist/ssr";

import { Navbar } from "@/components/layout/navbar";
import { PageShell } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const highlights = [
  {
    label: "Instant complaint reference",
    detail:
      "Get a case ID immediately and track every update from authorities.",
    icon: MapPin,
  },
  {
    label: "Tourist-first filing",
    detail:
      "Submit harassment, overcharging, safety, and service issues from anywhere.",
    icon: GlobeHemisphereWest,
  },
  {
    label: "Trusted local response",
    detail:
      "Authorities see your case clearly and can act faster with verified reports.",
    icon: ShieldCheck,
  },
];

const stepCards = [
  {
    title: "Register in minutes",
    description:
      "Create your account and verify your tourist profile before filing a complaint.",
    icon: UsersThree,
  },
  {
    title: "Submit your report",
    description:
      "Add what happened, upload evidence, and choose the right category for your issue.",
    icon: Sparkle,
  },
  {
    title: "Track progress",
    description:
      "Follow a live status feed and receive updates from the assigned authority.",
    icon: CheckCircle,
  },
];

export default function Home() {
  return (
    <>
      <Navbar />
      <PageShell>
        <section className="grid gap-10 lg:grid-cols-[1.4fr_0.9fr]">
          <div className="space-y-10">
            <div className="overflow-hidden rounded-[2rem] border border-border/70 bg-surface p-8 shadow-[0_24px_90px_rgba(20,20,20,0.06)] sm:p-12">
              <Badge variant="secondary">Tourist grievance desk</Badge>
              <div className="mt-8 max-w-3xl">
                <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
                  Awaaz helps travellers report unsafe service, scams and civic
                  incidents with confidence.
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                  File complaints, upload evidence, and follow every response
                  from local authorities in one calm, easy-to-use platform.
                </p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button asChild size="lg">
                  <Link href="/register">Register free</Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="/login">Sign in</Link>
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {highlights.map((item) => (
                <Card key={item.label} className="bg-surface">
                  <CardContent className="flex h-full flex-col justify-between gap-5 p-6">
                    <div className="flex items-center gap-3 text-primary">
                      <item.icon size={24} weight="duotone" />
                      <p className="text-sm font-semibold text-foreground">
                        {item.label}
                      </p>
                    </div>
                    <p className="text-sm leading-6 text-muted-foreground">
                      {item.detail}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {stepCards.map((step) => (
                <Card key={step.title} className="bg-surface">
                  <CardContent className="space-y-4 p-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <step.icon size={24} weight="duotone" />
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold text-foreground">
                        {step.title}
                      </h2>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-surface">
              <CardHeader>
                <CardTitle>Why travellers choose Awaaz</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 text-sm leading-6 text-muted-foreground">
                <p>
                  Awaaz is built for people who need a simple way to report
                  city-level issues without navigating complex bureaucratic
                  portals.
                </p>
                <p>
                  Every report gets a tracking ID, clear status updates, and a
                  direct authority response path so you can move on with your
                  trip.
                </p>
                <p>
                  The platform is focused on safety, service trust, and timely
                  follow-up from local agencies, not on subscription or
                  enterprise features.
                </p>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-6">
            <Card className="bg-surface">
              <CardHeader>
                <CardTitle>Trusted categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                <div className="grid gap-2">
                  {[
                    "Taxi or ride-share scams",
                    "Harassment or unsafe service",
                    "Lost or stolen belongings",
                    "Public transport issues",
                    "Hotel or booking fraud",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-border/70 bg-background/80 px-4 py-3 text-sm text-foreground"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface">
              <CardHeader>
                <CardTitle>What you get</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 p-6 text-sm leading-6 text-muted-foreground">
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">
                    Clear case tracking
                  </p>
                  <p>
                    Know when your complaint is reviewed, assigned, and
                    investigated.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">
                    Evidence upload
                  </p>
                  <p>
                    Attach photos, documents, or screenshots that help
                    authorities act quickly.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="font-semibold text-foreground">
                    Fast follow-up
                  </p>
                  <p>
                    Local authorities receive your report in a format they can
                    process without delay.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-surface">
              <CardHeader>
                <CardTitle>Ready to report?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5 p-6">
                <p className="text-sm leading-6 text-muted-foreground">
                  Use Awaaz as a travel companion to submit civic complaints
                  confidently and keep track of every step.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <Button asChild size="lg" className="min-w-35">
                    <Link href="/register">Register</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="min-w-35"
                  >
                    <Link href="/login">Sign in</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </aside>
        </section>

        <Separator className="my-10" />

        <section className="grid gap-8 rounded-[2rem] border border-border/70 bg-surface p-8 shadow-[0_24px_90px_rgba(20,20,20,0.06)] sm:p-10">
          <div className="grid gap-2 text-center">
            <p className="text-sm uppercase tracking-[0.22em] text-muted-foreground">
              Built for tourist trust
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              A single place to file complaints, follow responses, and feel
              supported while traveling.
            </h2>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-background/80 p-6 text-sm leading-6 text-muted-foreground shadow-[inset_0_1px_0_rgb(255,255,255,0.6)]">
              <p className="font-semibold text-foreground">
                Mobile-friendly flow
              </p>
              <p className="mt-2">
                Designed for quick case filing on a phone in unfamiliar cities.
              </p>
            </div>
            <div className="rounded-3xl bg-background/80 p-6 text-sm leading-6 text-muted-foreground shadow-[inset_0_1px_0_rgb(255,255,255,0.6)]">
              <p className="font-semibold text-foreground">
                Clear authority handoff
              </p>
              <p className="mt-2">
                Reports are formatted so local agencies can respond with
                confidence.
              </p>
            </div>
          </div>
        </section>
      </PageShell>
    </>
  );
}
