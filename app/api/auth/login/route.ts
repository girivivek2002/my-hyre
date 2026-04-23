import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import jwt from "jsonwebtoken";
import { checkRateLimit } from "@/lib/security";

const JWT_SECRET = (process.env.JWT_SECRET as string).replace(/['"]+/g, '');

export async function POST(req: NextRequest) {
  try {
    // 4. ANTI-SPAM: Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { candidateProfile: true, recruiterProfile: true }
    });

    if (!user || user.password !== password) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Check if profile is complete
    let isProfileComplete = false;
    if (user.role === "candidate") {
      isProfileComplete = !!(user.candidateProfile);
    } else if (user.role === "recruiter") {
      isProfileComplete = !!(user.recruiterProfile);
    }

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      message: "Login successful",
      token,
      isProfileComplete,
      user: { id: user.id, name: user.name, role: user.role, email: user.email },
    }, { status: 200 });
  } catch (error: any) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
