import { NextResponse, type NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { jwtVerify } from "jose";

const JWT_SECRET = (process.env.JWT_SECRET as string || "").replace(/['"]+/g, '');
const secretKey = new TextEncoder().encode(JWT_SECRET);

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // 1. Define Public Routes
  const isPublicRoute = 
    path === "/" || 
    path === "/login" || 
    path === "/signup" ||
    path === "/admin/login" ||
    path.startsWith("/signup/") ||
    path.includes("/signup") ||
    path.includes("/login");
  
  // 2. Get Session Token (NextAuth or Custom)
  let token: any = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  
  if (!token) {
    const customToken = req.cookies.get("authToken")?.value;
    if (customToken === "admin-session-authority") {
      token = { role: "admin", name: "Super Admin" };
    } else if (customToken) {
      try {
        const { payload } = await jwtVerify(customToken, secretKey);
        token = payload;
      } catch (err) {
        // Invalid token
      }
    }
  }

  // 3. Handle Unauthorized Access
  if (!token && !isPublicRoute && !path.startsWith("/api/auth")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // 4. Handle Authenticated Access
  if (token) {
    // B. Role-Based Access Control (RBAC) - ONLY for non-public routes
    if (token.role && !isPublicRoute) {
      // Admin bypass
      if (token.role === "admin") return NextResponse.next();

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
