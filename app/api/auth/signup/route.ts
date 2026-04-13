import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";

const MOCK_TOKEN = "mock-jwt-token-for-development";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, role } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await prisma.waitlist.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered." }, { status: 400 });
    }

    // Create user (storing in waitlist for mock)
    const user = await prisma.waitlist.create({
      data: {
        email,
        name,
        role: role || 'candidate',
      },
    });

    // Mock token
    const token = MOCK_TOKEN;

    return NextResponse.json({
      message: "User created successfully",
      token,
      user: { id: user.id, name: user.name, role: user.role, email: user.email },
    }, { status: 201 });
  } catch (error: any) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
