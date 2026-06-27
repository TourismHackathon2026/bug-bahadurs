import Link from "next/link"

import { ShieldCheck } from "@phosphor-icons/react/dist/ssr"

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
    <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href={session ? getRoleHome(session.role) : "/"} className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-md border border-primary/20 bg-secondary text-primary">
            <ShieldCheck size={20} weight="fill" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">Awaaz</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {session ? `${session.displayName} | ${session.role}` : "Tourist complaint desk"}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          {session ? (
            <>
              <Badge variant="secondary">{session.role}</Badge>
              <NotificationBell unreadCount={3} />
              <Avatar className="size-9">
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
