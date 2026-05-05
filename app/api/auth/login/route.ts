import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { checkRateLimit } from "@/lib/security";

const JWT_SECRET = (process.env.JWT_SECRET as string).replace(/['"]+/g, '');

export async function POST(req: NextRequest) {
  try {
    // ANTI-SPAM: Rate Limiting
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

    // OAuth account detection
    if (user && user.password === "oauth-placeholder-password") {
      return NextResponse.json({ 
        error: "This account was created with Google or LinkedIn. Please sign in using that method." 
      }, { status: 401 });
    }

    // Verify password using bcrypt (with fallback for legacy plaintext passwords)
    let passwordValid = false;
    if (user) {
      if (user.password.startsWith("$2")) {
        // Bcrypt hash detected
        passwordValid = await bcrypt.compare(password, user.password);
      } else {
        // Legacy plaintext comparison (for existing users not yet migrated)
        passwordValid = user.password === password;

        // Auto-migrate: hash the plaintext password now for future logins
        if (passwordValid) {
          const hashedPassword = await bcrypt.hash(password, 12);
          await prisma.user.update({ 
            where: { id: user.id }, 
            data: { password: hashedPassword } 
          });
        }
      }
    }

    if (!user || !passwordValid) {
      return NextResponse.json({ 
        error: "Invalid credentials. Please check your email and password." 
      }, { status: 401 });
    }

    // Role Synchronization
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
