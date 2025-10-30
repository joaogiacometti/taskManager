import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = [
  "/login",
  "/register",
  "/api/login",
  "/api/register",
  "/api/forgot-password",
  "/favicon.ico",
  "/api/health",
  "/_next",
  "/assets",
];

function isPublic(pathname: string) {
  return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

export async function proxy(req: NextRequest) {
  const { nextUrl, cookies } = req;
  const pathname = nextUrl.pathname;

  if (isPublic(pathname)) {
    if (
      (pathname === "/login" || pathname === "/register") &&
      cookies.has(".AspNetCore.Identity.Application")
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  if (!cookies.has(".AspNetCore.Identity.Application")) {
    const url = new URL("/login", req.url);
    url.searchParams.set("returnUrl", pathname + nextUrl.search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets/).*)"],
};
