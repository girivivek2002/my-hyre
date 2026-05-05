import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Prisma, Role } from "@/src/generated/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { checkRateLimit, isDisposableEmail } from "@/lib/security";

export const dynamic = "force-dynamic";

const JWT_SECRET = (process.env.JWT_SECRET as string).replace(/['"]+/g, '');
const SALT_ROUNDS = 12;

export async function POST(req: NextRequest) {
  try {
    // ANTI-SPAM: Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!checkRateLimit(ip)) {
      return NextResponse.json({ error: "Too many requests. Please try again in a minute." }, { status: 429 });
    }

    const body = await req.json();
    const email = body.email?.trim().toLowerCase();
    const password = body.password?.trim();
    const { name, role, phone, website, industry, teamSize } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields." }, { status: 400 });
    }

    // Password strength validation
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    // ANTI-SPAM: Block Disposable Emails
    if (isDisposableEmail(email)) {
      return NextResponse.json({ error: "Please use a legitimate email address." }, { status: 400 });
    }

    // Check if the user or profile already exists
    const [existingUser, existingCandidate, existingRecruiter] = await Promise.all([
      prisma.user.findUnique({ where: { email } }),
      prisma.candidate.findUnique({ where: { email } }),
      prisma.recruiter.findUnique({ where: { email } })
    ]);

    if (existingUser || existingCandidate || existingRecruiter) {
      return NextResponse.json({ error: "Email already registered." }, { status: 400 });
    }

    // Hash password with bcrypt
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const assignedRole = role === "recruiter" ? Role.recruiter : Role.candidate;

    // Create user and associated profile in a transaction
    const user = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
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
            companyName: name,
            industry,
            companySize: teamSize,
          },
        });
      }

      return newUser;
    });

    // Clean up OTP records for this email
    await prisma.otpVerification.deleteMany({ where: { email } });

    // Mark user as verified
    await prisma.user.update({
      where: { id: user.id },
      data: { isVerified: true },
    });

    const token = jwt.sign(
      { 
        id: user.id, 
        role: user.role, 
        email: user.email, 
        name: user.name,
        isProfileComplete: true 
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    const response = NextResponse.json({
      message: "User registered successfully",
      token,
      isProfileComplete: true,
      user: { id: user.id, name: user.name, role: user.role, email: user.email },
    }, { status: 201 });

    // Set cookie for middleware
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("Signup Error:", error);
    // Never expose internal error details to the client
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
