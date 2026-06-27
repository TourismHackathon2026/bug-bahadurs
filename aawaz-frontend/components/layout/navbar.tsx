import Link from "next/link"

import { ShieldCheck, Sparkle } from "@phosphor-icons/react/dist/ssr"

import { logout } from "@/actions/auth.actions"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { NotificationBell } from "@/components/notification/notification-bell"
import { getSession } from "@/lib/session"
import { getRoleHome } from "@/lib/session-token"

function getInitials(displayName: string): string {
  return displayName
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase()
}

export async function Navbar() {
  const session = await getSession()

  return (
    <header className="sticky top-0 z-20 border-b border-foreground/10 bg-background/72 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href={session ? getRoleHome(session.role) : "/"} className="flex items-center gap-3">
          <div className="relative flex size-10 items-center justify-center rounded-lg bg-foreground text-background shadow-[0_16px_40px_oklch(0.14_0.018_248_/_0.18)]">
            <ShieldCheck size={20} weight="fill" />
            <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center rounded-full bg-accent text-[9px] text-accent-foreground">
              <Sparkle size={10} weight="fill" />
            </span>
          </div>
          <div>
            <p className="font-heading text-xl font-semibold leading-none tracking-normal">Awaaz</p>
            <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {session ? `${session.displayName} | ${session.role}` : "Tourist complaint desk"}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2 sm:gap-3">
          {session ? (
            <>
              <Badge variant="secondary" className="hidden sm:inline-flex">{session.role}</Badge>
              <NotificationBell unreadCount={3} />
              <Avatar className="size-10 ring-2 ring-background shadow-[0_10px_24px_oklch(0.14_0.018_248_/_0.12)]">
                <AvatarFallback>{getInitials(session.displayName)}</AvatarFallback>
              </Avatar>
              <form action={logout}>
                <Button type="submit" variant="ghost" size="sm">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link href="/login">Sign in</Link>
              </Button>
              <Button asChild size="sm">
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
