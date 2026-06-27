import { Navbar } from "@/components/layout/navbar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Navbar />
      <div className="flex-1 flex">
        {/* Navigation Sidebar for Admin */}
        <aside className="w-64 border-r bg-card hidden md:block">
          <nav className="space-y-1 p-4">
            {[
              { label: "Pending Registrations", href: "/admin/registrations" },
              { label: "All Complaints", href: "/admin/complaints" },
              { label: "Manage Authorities", href: "/admin/authorities" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="flex rounded-md px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-primary"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </aside>
        
        <main className="flex-1">
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
