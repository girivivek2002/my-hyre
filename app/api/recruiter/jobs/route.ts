import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-fallback-key";

async function verifyRecruiter(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return null;
  try {
    const decoded: any = jwt.verify(auth.split(" ")[1], JWT_SECRET);
    if (decoded.role !== "recruiter") return null;
    return decoded;
  } catch {
    return null;
  }
}

// GET: List all jobs for the authenticated recruiter
export async function GET(req: NextRequest) {
  const user = await verifyRecruiter(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: user.id },
    });

    if (!recruiter) {
      return NextResponse.json({ jobs: [] });
    }

    const jobs = await prisma.job.findMany({
      where: { recruiterId: recruiter.id },
      include: {
        _count: { select: { shortlists: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const formatted = jobs.map((j) => ({
      id: j.id,
      title: j.title,
      company: j.company,
      location: j.location,
      salary: j.salary,
      type: j.type,
      experience: j.experience,
      description: j.description,
      skills: j.skills,
      applicants: j._count.shortlists,
      createdAt: j.createdAt,
    }));

    return NextResponse.json({ jobs: formatted });
  } catch (error: any) {
    console.error("Recruiter Jobs GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Create a new job listing
export async function POST(req: NextRequest) {
  const user = await verifyRecruiter(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await req.json();
    const { title, location, salary, type, experience, description, skills } = body;

    if (!title) {
      return NextResponse.json({ error: "Job title is required" }, { status: 400 });
    }

    // Find or self-heal recruiter profile
    let recruiter = await prisma.recruiter.findUnique({
      where: { userId: user.id },
    });

    if (!recruiter) {
      const userRecord = await prisma.user.findUnique({ where: { id: user.id } });
      if (!userRecord) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }
      recruiter = await prisma.recruiter.create({
        data: {
          userId: userRecord.id,
          name: userRecord.name,
          email: userRecord.email,
          companyName: userRecord.name,
          companySize: userRecord.teamSize || "1-10",
          industry: userRecord.industry || "Technology",
        },
      });
    }

    const job = await prisma.job.create({
      data: {
        title,
        company: recruiter.companyName,
        location: location || "Remote",
        salary: salary || null,
        type: type || "hybrid",
        experience: experience || "Not specified",
        description: description || null,
        skills: skills || [],
        recruiterId: recruiter.id,
      },
    });

    return NextResponse.json({ message: "Job deployed successfully", job }, { status: 201 });
  } catch (error: any) {
    console.error("Recruiter Jobs POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
  }
}
