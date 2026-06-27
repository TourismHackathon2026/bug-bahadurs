import Link from "next/link"
import { ChartPolar, Files, Gauge, MapTrifold, Bell } from "@phosphor-icons/react/dist/ssr"
import { Navbar } from "@/components/layout/navbar"

export default function AuthorityLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex-1 flex">
        <aside className="hidden w-72 border-r border-sidebar-border bg-sidebar text-sidebar-foreground md:block">
          <nav className="sticky top-18 space-y-2 p-5">
            {[
              { label: "Overview", href: "/authority/dashboard", icon: Gauge },
              { label: "Complaints", href: "/authority/complaints", icon: Files },
              { label: "Heatmap", href: "/authority/heatmap", icon: MapTrifold },
              { label: "Notifications", href: "/authority/notifications", icon: Bell },
            ].map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold text-sidebar-foreground/72 transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              >
                <link.icon size={18} weight="duotone" />
                {link.label}
              </Link>
            ))}
            <div className="mt-8 rounded-lg border border-sidebar-border bg-white/5 p-4">
              <ChartPolar size={22} className="text-sidebar-primary" weight="duotone" />
              <p className="mt-3 text-xs font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/55">Live routing</p>
              <p className="mt-1 text-sm leading-5 text-sidebar-foreground/78">New cases route by category to your desk.</p>
            </div>
          </nav>
        </aside>
        
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
