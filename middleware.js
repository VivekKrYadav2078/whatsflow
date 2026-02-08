import { NextResponse } from "next/server"; // 👈 This is likely missing!
import { jwtVerify } from "jose";

export async function middleware(request) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  // 1. Skip the "Front Door" (Login API)
  if (pathname === "/api/login") {
    return NextResponse.next();
  }

  // 2. Define what needs a JWT
  const isDashboardPage = pathname.startsWith("/dashboard");
  const isApiRoute = pathname.startsWith("/api"); // Catch ALL APIs

  if (isDashboardPage || isApiRoute) {
    if (!token) {

       
      if (isApiRoute)  return NextResponse.json(
      { message: "Not Found", status: 404 }, 
      { status: 404 })
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      await jwtVerify(token, secret);
      return NextResponse.next();
    } catch (err) {
      if (isApiRoute) return NextResponse.json({ error: "Invalid Session" }, { status: 401 });
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  // 🟢 Catch everything in dashboard and every single API
  matcher: ['/dashboard/:path* '],
};