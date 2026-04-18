import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";

const JWT_SECRET = (process.env.JWT_SECRET || "super-secret-fallback-key").replace(/['"]+/g, '');

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Access denied. No token provided." }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    // Fetch the user from the database directly, omitting password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        phone: true,
        website: true,
        industry: true,
        teamSize: true,
        createdAt: true,
        _count: {
          select: {
            resumes: true,
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User profile not found." }, { status: 404 });
    }

    return NextResponse.json({
      user,
      stats: {
        resumesUploaded: user._count.resumes, 
        matches: 0,
        interviews: 0, 
        shortlists: 0,
        profileStrength: 0, 
        activeJobs: 0,
        candidates: 0,
        hiringRate: 0
      }
    }, { status: 200 });

  } catch (error: any) {
    console.error("User Profile Error:", error);
    if (error.name === "JsonWebTokenError") {
      return NextResponse.json({ error: "Invalid token." }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
