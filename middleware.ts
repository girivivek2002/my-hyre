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
  
  // 2. Get Session Token (Priority: Admin Token -> NextAuth -> Custom Token)
  let token: any = null;
  const customToken = req.cookies.get("authToken")?.value;

  // Check if custom token is admin
  let parsedCustomToken: any = null;
  if (customToken) {
    try {
      const { payload } = await jwtVerify(customToken, secretKey);
      parsedCustomToken = payload;
    } catch (err) {}
  }

  // Priority logic
  if (parsedCustomToken?.role === "admin") {
    token = parsedCustomToken;
  } else {
    token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token && parsedCustomToken) {
      token = parsedCustomToken;
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
