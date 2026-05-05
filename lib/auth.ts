import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";
import { getToken } from "next-auth/jwt";

const JWT_SECRET = (process.env.JWT_SECRET as string).replace(/['"]+/g, '');
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

/**
 * Core Session Verification Logic
 * Checks both NextAuth and Custom AuthToken (Cookie/Header)
 */
export async function getSession(req: NextRequest) {
  let userId: string | null = null;
  let userEmail: string | null = null;
  let userName: string | null = null;
  let userRole: string | null = null;

  // 0. Priority Override: Check if cookie is an Admin Token
  const cookieToken = req.cookies.get("authToken")?.value;
  if (cookieToken && cookieToken !== "null") {
    try {
      const decoded: any = jwt.verify(cookieToken, JWT_SECRET);
      if (decoded.role === "admin") {
        return { id: decoded.id, email: decoded.email, name: decoded.name, role: decoded.role };
      }
    } catch (err) {}
  }

  // 1. Try Explicit Authorization Header (Custom JWT) FIRST
  const auth = req.headers.get("authorization");
  const bearerToken = auth?.startsWith("Bearer ") ? auth.split(" ")[1] : null;

  if (bearerToken && bearerToken !== "null") {
    try {
      const decoded: any = jwt.verify(bearerToken, JWT_SECRET);
      userId = decoded.id;
      userEmail = decoded.email;
      userName = decoded.name;
      userRole = decoded.role;
    } catch (err) {
      // Invalid bearer token
    }
  }

  // 2. Try NextAuth Token if no valid bearer token
  if (!userId) {
    const nextAuthToken = await getToken({ req, secret: NEXTAUTH_SECRET });
    if (nextAuthToken) {
      userId = (nextAuthToken.userId as string) || null;
      userEmail = nextAuthToken.email || null;
      userName = nextAuthToken.name || null;
      userRole = (nextAuthToken.role as string) || null;
    }
  }

  // 3. Try Custom JWT Cookie as last resort (for non-admin roles)
  if (!userId && cookieToken && cookieToken !== "null") {
    try {
      const decoded: any = jwt.verify(cookieToken, JWT_SECRET);
      userId = decoded.id;
      userEmail = decoded.email;
      userName = decoded.name;
      userRole = decoded.role;
    } catch (err) {
      // Invalid cookie token
    }
  }

  if (!userId) return null;

  return { id: userId, email: userEmail, name: userName, role: userRole };
}

/**
 * Verifies a Recruiter session and returns the recruiter profile.
 */
export async function verifyRecruiter(req: NextRequest, options: { strict?: boolean } = { strict: true }) {
  const session = await getSession(req);
  if (!session || (session.role !== "recruiter" && session.role !== "admin")) return null;

  const recruiter = await prisma.recruiter.findUnique({
    where: { userId: session.id },
    include: { user: true }
  });

  if (recruiter) {
    return { 
      ...session,
      isVerified: recruiter.isVerified || recruiter.user?.isVerified || false, 
      profile: recruiter 
    };
  }

  // If strict mode is ON, we fail if no profile exists
  if (options.strict) return null;

  // Fallback: User exists but Recruiter profile record doesn't
  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) return null;

  return {
    ...session,
    isVerified: user.isVerified,
    profile: null
  };
}

/**
 * Verifies a Candidate session and returns the candidate profile.
 */
export async function verifyCandidate(req: NextRequest, options: { strict?: boolean } = { strict: true }) {
  const session = await getSession(req);
  if (!session || session.role !== "candidate") return null;

  const candidate = await prisma.candidate.findUnique({
    where: { userId: session.id },
    include: { user: true }
  });

  if (candidate) {
    return { ...session, isVerified: candidate.user?.isVerified || false, profile: candidate };
  }

  // If strict mode is ON, we fail if no profile exists
  if (options.strict) return null;

  // Fallback: User exists but Candidate profile record doesn't
  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user) return null;

  return {
    ...session,
    isVerified: user.isVerified,
    profile: null
  };
}

/**
 * Verifies an Admin session.
 */
export async function verifyAdmin(req: NextRequest) {
  const session = await getSession(req);
  if (!session || session.role !== "admin") return null;
  return session;
}
