import { auth } from "./auth";
import { NextResponse } from "next/server";

export const proxy = auth((req) => {
  const isLoggedin = !!req.auth;
  const { nextUrl } = req;

  if (
    isLoggedin &&
    (nextUrl.pathname === "/login" || nextUrl.pathname === "/register")
  ) {
    return NextResponse.redirect(new URL("/", nextUrl));
  }
});

export const config = {
  matcher: [
    // Match all request paths except static files and Next.js internals
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
