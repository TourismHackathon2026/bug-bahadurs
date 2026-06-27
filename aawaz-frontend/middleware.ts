import { NextRequest, NextResponse } from "next/server"

import { Role } from "@/lib/constants"
import { getRoleHome, SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/session-token"

const PROTECTED_PREFIXES = ["/dashboard", "/notifications", "/complaints", "/authority", "/admin"]

function getRequiredRole(pathname: string): Role | null {
  if (pathname.startsWith("/admin")) return Role.ADMIN
  if (pathname.startsWith("/authority")) return Role.AUTHORITY
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/notifications") ||
    pathname.startsWith("/complaints")
  ) {
    return Role.TOURIST
  }
  return null
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value
  const session = token ? await verifySessionToken(token) : null
  const requiredRole = getRequiredRole(pathname)

  if (pathname === "/" && session) {
    return NextResponse.redirect(new URL(getRoleHome(session.role), request.url))
  }

  if ((pathname === "/login" || pathname === "/register") && session) {
    return NextResponse.redirect(new URL(getRoleHome(session.role), request.url))
  }

  if (!isProtectedRoute(pathname)) {
    return NextResponse.next()
  }

  if (!session) {
    const loginUrl = new URL("/login", request.url)
    loginUrl.searchParams.set("next", pathname)
    return NextResponse.redirect(loginUrl)
  }

  if (requiredRole && session.role !== requiredRole) {
    return NextResponse.redirect(new URL(getRoleHome(session.role), request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/notifications/:path*", "/complaints/:path*", "/authority/:path*", "/admin/:path*", "/login", "/register"],
}
