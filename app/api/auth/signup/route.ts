import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-fallback-key";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, phone, role, website, industry, teamSize } = body;

    if (!email || !password || !name || !role) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered." }, { status: 400 });
    }

    // Hash the password securely
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user into DB
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        role,
        phone,
        website,
        industry,
        teamSize,
      },
    });

    // Generate token
    const token = jwt.sign({ id: user.id, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: "7d" });

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
