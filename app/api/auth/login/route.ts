import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import jwt from "jsonwebtoken";
import { checkRateLimit } from "@/lib/security";

const JWT_SECRET = (process.env.JWT_SECRET as string).replace(/['"]+/g, '');

export async function POST(req: NextRequest) {
  try {
    console.log("DB_URL present:", !!process.env.DATABASE_URL);
    console.log("JWT_SECRET present:", !!process.env.JWT_SECRET);

    // 4. ANTI-SPAM: Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await req.json();
    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { candidateProfile: true, recruiterProfile: true }
    });

    console.log("Login Attempt:", { email, found: !!user, passwordMatch: user?.password === password });

    console.log("Login Attempt Debug:", { 
      inputEmail: email, 
      dbEmail: user?.email, 
      found: !!user, 
      inputPassword: password, 
      dbPassword: user?.password, 
      match: user?.password === password 
    });

    if (user && user.password === "oauth-placeholder-password") {
      return NextResponse.json({ 
        error: "This account was created with Google or LinkedIn. Please sign in using that method." 
      }, { status: 401 });
    }

    if (!user || user.password !== password) {
      return NextResponse.json({ 
        error: "Invalid credentials. Please check your email and password." 
      }, { status: 401 });
    }

    // Role Synchronization: If role is candidate but only recruiter profile exists (or vice versa), fix it.
    let effectiveRole = user.role;
    if (user.role === "candidate" && !user.candidateProfile && user.recruiterProfile) {
      effectiveRole = "recruiter";
      await prisma.user.update({ where: { id: user.id }, data: { role: "recruiter" } });
    } else if (user.role === "recruiter" && !user.recruiterProfile && user.candidateProfile) {
      effectiveRole = "candidate";
      await prisma.user.update({ where: { id: user.id }, data: { role: "candidate" } });
    }

    // Check if profile is complete
    let isProfileComplete = false;
    if (effectiveRole === "candidate") {
      isProfileComplete = !!(user.candidateProfile);
    } else if (effectiveRole === "recruiter") {
      isProfileComplete = !!(user.recruiterProfile);
    }

    const token = jwt.sign(
      { 
        id: user.id, 
        role: effectiveRole, 
        email: user.email,
        name: user.name,
        isProfileComplete 
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      message: "Login successful",
      token,
      isProfileComplete,
      user: { id: user.id, name: user.name, role: user.role, email: user.email },
    }, { status: 200 });

    // Set cookie for middleware to read
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
