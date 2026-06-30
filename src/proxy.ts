import { auth } from "@/auth";
import { NextResponse } from "next/server";

function withCartSid(req: any, resp: NextResponse): NextResponse {
  if (!req.cookies.has("cart_sid")) {
    resp.cookies.set("cart_sid", crypto.randomUUID(), {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 14,
      path: "/",
    });
  }
  return resp;
}

export const proxy = auth((req) => {
  const isLoggedIn = !!req.auth;
  const role = (req.auth as any)?.user?.role;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    const isLoginPage = pathname === "/admin/login";
    if (isLoginPage && isLoggedIn) {
      return NextResponse.redirect(new URL("/admin", req.nextUrl.origin));
    }
    if (!isLoginPage && !isLoggedIn) {
      return NextResponse.redirect(new URL("/admin/login", req.nextUrl.origin));
    }
    if (!isLoginPage && isLoggedIn && role !== "admin") {
      return NextResponse.redirect(new URL("/", req.nextUrl.origin));
    }
  }

  const customerRoutes = ["/profile", "/checkout"];
  if (customerRoutes.some((r) => pathname.startsWith(r)) && !isLoggedIn) {
    const cb = encodeURIComponent(pathname);
    return NextResponse.redirect(
      new URL(`/login?callbackUrl=${cb}`, req.nextUrl.origin)
    );
  }

  return withCartSid(req, NextResponse.next());
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
