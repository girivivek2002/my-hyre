import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { Prisma } from "@/src/generated/client";
import jwt from "jsonwebtoken";

export const dynamic = "force-dynamic";

const JWT_SECRET = (process.env.JWT_SECRET || "super-secret-fallback-key").replace(/['"]+/g, '');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, name, role, phone, website, industry, teamSize } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields: email, password, and name are mandatory." }, { status: 400 });
    }

    // Check if the user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "Email already registered." }, { status: 400 });
    }

    const assignedRole = role === "recruiter" ? "recruiter" : "candidate";

    // Create user and associated profile in a transaction
    const user = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const newUser = await tx.user.create({
        data: {
          email,
          password, // In a real app, hash the password
          name,
          role: assignedRole,
          phone,
          website,
          industry,
          teamSize,
        },
      });

      if (assignedRole === "candidate") {
        await tx.candidate.create({
          data: {
            userId: newUser.id,
            name,
            email,
            role: "Job Seeker", // Default initial role
          },
        });
      } else if (assignedRole === "recruiter") {
        await tx.recruiter.create({
          data: {
            userId: newUser.id,
            name, // Recruiter name is same as display name initially
            email,
            companyName: name, // For recruiter signup, 'name' typically represents the company
            industry,
            companySize: teamSize,
          },
        });
      }

      return newUser;
    }, {
      timeout: 10000 // Increase timeout for database transactions
    });

    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({
      message: "User registered successfully",
      token,
      user: { id: user.id, name: user.name, role: user.role, email: user.email },
    }, { status: 201 });
  } catch (error: any) {
    console.error("Signup Error Detailed:", error);
    // Return the actual error message in development/investigative mode to help debugging
    return NextResponse.json({ 
      error: "Critical failure during identity synthesis.", 
      message: error.message,
      stack: error.stack 
    }, { status: 500 });
  }
}
