import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

const JWT_SECRET = (process.env.JWT_SECRET || "super-secret-fallback-key").replace(/['"]+/g, '');

async function verifyRecruiter(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    console.error("[AUTH DEBUG] Header Missing or Invalid:", auth);
    return null;
  }
  try {
    const token = auth.split(" ")[1];
    // console.log("[AUTH DEBUG] Verifying token with secret length:", JWT_SECRET.length);
    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    if (decoded.role !== "recruiter") {
      console.error("[AUTH DEBUG] Role Mismatch. Expected 'recruiter', got:", decoded.role, "for user:", decoded.email);
      return null;
    }
    
    // Check if the user exists in the Recruiter table
    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: decoded.id }
    });
    
    if (!recruiter) {
      console.error("[AUTH DEBUG] Valid recruiter token but no entry in Recruiter table for userId:", decoded.id);
      return null;
    }

    return decoded;
  } catch (err: any) {
    console.error("[AUTH DEBUG] JWT Verification Failed:", err.message);
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

    const formatted = jobs.map((j: any) => ({
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
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized: Missing or invalid Authorization header" }, { status: 401 });
  }
  
  try {
    const token = auth.split(" ")[1];
    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    if (decoded.role !== "recruiter") {
      return NextResponse.json({ error: `Unauthorized: Role mismatch. Expected recruiter, got ${decoded.role}` }, { status: 401 });
    }
    
    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: decoded.id }
    });
    
    if (!recruiter) {
      return NextResponse.json({ error: "Unauthorized: Recruiter profile not found in database" }, { status: 401 });
    }

    const user = decoded;
    const body = await req.json();
    const { title, location, salary, type, experience, description, skills } = body;

    if (!title) {
      return NextResponse.json({ error: "Job title is required" }, { status: 400 });
    }

    const job = await prisma.job.create({
      data: {
        title,
        company: recruiter.companyName,
        location: location || "Remote",
        salary: salary || "Competitive",
        type: type || "Full-time",
        experience: experience || "Any",
        description: description || `Join ${recruiter.companyName} as a ${title}.`,
        skills: Array.isArray(skills) ? skills : (skills ? String(skills).split(",").map((s: string) => s.trim()) : []),
        recruiterId: recruiter.id,
      },
    });

    // AUTO-SHORTLIST LOGIC:
    // When a job is posted, automatically shortlist candidates whose profile role or skills match
    const jobSkills = Array.isArray(skills) ? skills : (skills ? String(skills).split(",").map((s: string) => s.trim()) : []);
    const titleKeywords = title.split(/[\s-]+/).filter((k: string) => k.length > 2);
    const normalizedTitle = title.replace(/-/g, ' ');
    const alternateTitle = title.replace(/-/g, '');
    const searchTerms = Array.from(new Set([title, normalizedTitle, alternateTitle, ...jobSkills]));
    
    const matchingCandidates = await prisma.candidate.findMany({
      where: {
        OR: [
          { role: { contains: title, mode: 'insensitive' } },
          { biography: { contains: title, mode: 'insensitive' } },
          { skills: { hasSome: searchTerms } },
          // Keyword matching for role and biography
          ...titleKeywords.map((k: string) => ({ role: { contains: k, mode: 'insensitive' as const } })),
          ...titleKeywords.map((k: string) => ({ biography: { contains: k, mode: 'insensitive' as const } }))
        ]
      },
      take: 10
    });

    if (matchingCandidates.length > 0) {
      await Promise.all(matchingCandidates.map((candidate: any) => 
        prisma.shortlist.upsert({
          where: {
            candidateId_jobId: {
              candidateId: candidate.id,
              jobId: job.id
            }
          },
          update: {},
          create: {
            candidateId: candidate.id,
            jobId: job.id,
            status: "SHORTLISTED"
          }
        }).catch(() => null)
      ));
    }

    return NextResponse.json({ message: "Job intelligence deployed", job, autoShortlisted: matchingCandidates.length }, { status: 201 });
  } catch (error: any) {
    console.error("Job Creation Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
