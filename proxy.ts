import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 1. Define Public Routes
  const isPublicRoute = path === "/" || path === "/login" || path.startsWith("/signup");
  
  // 2. Get Session Token
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 3. Handle Unauthorized Access
  if (!token && !isPublicRoute && !path.startsWith("/api/auth")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 4. Handle Authenticated Access
  if (token) {
    // A. Force Onboarding if profile is incomplete
    const isCompletingProfile = path === "/complete-profile";
    const isProfileComplete = (token as any).isProfileComplete;

    if (!isProfileComplete && !isCompletingProfile && !path.startsWith("/api")) {
      return NextResponse.redirect(new URL("/complete-profile", req.url));
    }

    // B. Role-Based Access Control (RBAC)
    if (path.startsWith("/candidate") && token.role !== "candidate") {
      return NextResponse.redirect(new URL("/recruiter/dashboard", req.url));
    }
    if (path.startsWith("/recruiter") && token.role !== "recruiter") {
      return NextResponse.redirect(new URL("/candidate/dashboard", req.url));
    }
    if (path.startsWith("/admin") && token.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    "/candidate/:path*",
    "/recruiter/:path*",
    "/admin/:path*",
    "/complete-profile",
    "/api/candidate/:path*",
    "/api/recruiter/:path*",
  ],
};
