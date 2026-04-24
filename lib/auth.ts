import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";
import { getToken } from "next-auth/jwt";

const JWT_SECRET = (process.env.JWT_SECRET || "super-secret-fallback-key").replace(/['"]+/g, '');
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

export async function verifyRecruiter(req: NextRequest) {
  let userId: string | null = null;
  let userEmail: string | null = null;
  let userName: string | null = null;

  // 1. Try NextAuth
  const nextAuthToken = await getToken({ req, secret: NEXTAUTH_SECRET });
  if (nextAuthToken && nextAuthToken.role === "recruiter") {
    userId = (nextAuthToken.userId as string) || null;
    userEmail = nextAuthToken.email || null;
    userName = nextAuthToken.name || null;
    
    if (!userId && userEmail) {
      const dbUser = await prisma.user.findUnique({ where: { email: userEmail } });
      if (dbUser) userId = dbUser.id;
    }
  }

  // 2. Try Custom JWT (Header or Cookie)
  if (!userId) {
    const auth = req.headers.get("authorization");
    const token = auth?.startsWith("Bearer ") ? auth.split(" ")[1] : req.cookies.get("authToken")?.value;
    
    if (token && token !== "null") {
      try {
        const decoded: any = jwt.verify(token, JWT_SECRET);
        if (decoded.role === "recruiter") {
          userId = decoded.id;
          userEmail = decoded.email;
          userName = decoded.name;
        }
      } catch (err) {}
    }
  }

  if (!userId) return null;

  // Fetch full recruiter profile for consistency
  const recruiter = await prisma.recruiter.findUnique({
    where: { userId },
    include: { user: true }
  });

  if (!recruiter || !recruiter.user) return null;

  return { 
    id: userId, 
    email: userEmail, 
    name: userName,
    role: "recruiter" as string,
    isVerified: recruiter.isVerified || recruiter.user.isVerified, 
    profile: recruiter 
  };
}
