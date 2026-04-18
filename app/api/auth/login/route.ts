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

    // Prioritize the central User table for authentication
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || user.password !== password) { // In a real app, use bcrypt.compare
      return NextResponse.json({ error: "Invalid credentials: Email or password mismatch." }, { status: 401 });
    }

    const role = user.role || "candidate";

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
    console.error("CRITICAL AUTH FAILURE:", error);
    
    // Check if it's a Prisma/Database connection error
    const isDbError = error.message?.includes("Can't reach database") || 
                      error.code === 'P1001' || 
                      error.name === 'PrismaClientInitializationError';

    return NextResponse.json({ 
      error: isDbError ? "Database Connectivity Failure." : "Authentication Node Failure.", 
      message: error.message,
      code: error.code,
      suggestion: isDbError ? "Check your Supabase pooler settings and Vercel environment variables." : "Consult the system logs for trace ID."
    }, { status: 500 });
  }
}
