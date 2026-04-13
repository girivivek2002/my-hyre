import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

const MOCK_TOKEN = "mock-jwt-token-for-development";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required." }, { status: 400 });
    }

    // Find the user in any model
    let user = await prisma.candidate.findUnique({ where: { email } });
    let role = "candidate";
    
    if (!user) {
      user = await prisma.recruiter.findUnique({ where: { email } });
      role = "recruiter";
    }
    
    if (!user) {
      user = await prisma.user?.findUnique?.({ where: { email } });
      role = "user";
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // For mock, accept any password
    const token = MOCK_TOKEN;

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
