import { ShieldCheck } from "@phosphor-icons/react/dist/ssr"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { NotificationBell } from "@/components/notification/notification-bell"

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex size-9 items-center justify-center rounded-md border border-primary/20 bg-secondary text-primary">
            <ShieldCheck size={20} weight="fill" />
          </div>
          <div>
            <p className="text-sm font-semibold leading-none">Awaaz</p>
            <p className="mt-1 text-xs text-muted-foreground">Tourist complaint desk</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="secondary">Tourist</Badge>
          <NotificationBell unreadCount={3} />
          <Avatar className="size-9">
            <AvatarFallback>SK</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  )
}
