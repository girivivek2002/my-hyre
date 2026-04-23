import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Prisma, Role } from "@/src/generated/client";
import jwt from "jsonwebtoken";
import { checkRateLimit, isDisposableEmail } from "@/lib/security";

export const dynamic = "force-dynamic";

const JWT_SECRET = (process.env.JWT_SECRET as string).replace(/['"]+/g, '');

export async function POST(req: NextRequest) {
  try {
    // 4. ANTI-SPAM: Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
    }

    const body = await req.json();
    const { email, password, name, role, phone, website, industry, teamSize } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // 4. ANTI-SPAM: Block Disposable Emails
    if (isDisposableEmail(email)) {
      return NextResponse.json({ error: "Please use a legitimate email address." }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered." }, { status: 400 });
    }

    const assignedRole = role === "recruiter" ? Role.recruiter : Role.candidate;

    // Create user and associated profile in a transaction
    const user = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password, // In a real app, hash the password
          name,
          role: assignedRole,
        },
      });

      if (assignedRole === Role.candidate) {
        await tx.candidate.create({
          data: {
            userId: newUser.id,
            name,
            email,
            role: "Job Seeker",
          },
        });
      } else if (assignedRole === Role.recruiter) {
        await tx.recruiter.create({
          data: {
            userId: newUser.id,
            name,
            email,
            companyName: name, // Initial placeholder
            industry,
            companySize: teamSize,
          },
        });
      }

      return newUser;
    });

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      message: "User registered successfully",
      token,
      isProfileComplete: false,
      user: { id: user.id, name: user.name, role: user.role, email: user.email },
    }, { status: 201 });
  } catch (error: any) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
