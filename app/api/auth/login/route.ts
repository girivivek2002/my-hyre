import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-fallback-key";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required." }, { status: 400 });
    }

    // Find the user in any model
    let user: any = await prisma.candidate.findUnique({ where: { email } });
    let role = "candidate";
    
    if (!user) {
      user = await prisma.recruiter.findUnique({ where: { email } });
      role = "recruiter";
    }
    
    if (!user) {
      user = await prisma.waitlist.findUnique({ where: { email } });
      role = "user";
    }
    
    if (!user) {
      // Also try User table since schema has User
      user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        role = user.role;
      }
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Sign a real JWT so /api/user/me can verify it
    const token = jwt.sign(
      { id: user.id, role, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      message: "Login successful",
      token,
      user: { id: user.id, name: user.name, role, email: user.email },
    }, { status: 200 });
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
