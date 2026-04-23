import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

const JWT_SECRET = (process.env.JWT_SECRET || "super-secret-fallback-key").replace(/['"]+/g, '');

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const decoded: any = jwt.verify(auth.split(" ")[1], JWT_SECRET);
    const profile = await prisma.candidate.findUnique({
      where: { userId: decoded.id }
    });
    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Profile GET Error:", error);
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const decoded: any = jwt.verify(auth.split(" ")[1], JWT_SECRET);
    const data = await req.json();

    // Map frontend fields to database fields
    const skillsArray = typeof data.skills === 'string' 
      ? data.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
      : Array.isArray(data.skills) ? data.skills : [];

    const candidate = await prisma.candidate.upsert({
      where: { userId: decoded.id },
      update: {
        name: data.name,
        role: data.desiredRole || data.role,
        experience: String(data.experience),
        location: data.location,
        workPreference: data.workType || data.workPreference,
        salaryExpectation: data.salary || data.salaryExpectation,
        noticePeriod: data.noticePeriod,
        skills: skillsArray,
        phone: data.phone,
        linkedin: data.linkedin,
        github: data.github,
        website: data.website,
      },
      create: {
        userId: decoded.id,
        name: data.name,
        email: decoded.email,
        role: data.desiredRole || data.role,
        experience: String(data.experience),
        location: data.location,
        workPreference: data.workType || data.workPreference,
        salaryExpectation: data.salary || data.salaryExpectation,
        noticePeriod: data.noticePeriod,
        skills: skillsArray,
        phone: data.phone,
        linkedin: data.linkedin,
        github: data.github,
        website: data.website,
      }
    });

    // AUTO-SHORTLIST LOGIC:
    // If a candidate updates their profile, find jobs that match their desired role
    const matchingJobs = await prisma.job.findMany({
      where: {
        OR: [
          { title: { contains: candidate.role || "", mode: 'insensitive' } },
          { description: { contains: candidate.role || "", mode: 'insensitive' } }
        ]
      },
      take: 5
    });

    if (matchingJobs.length > 0) {
      await Promise.all(matchingJobs.map((job: any) =>
        prisma.shortlist.upsert({
          where: {
            candidateId_jobId: {
              candidateId: candidate.id,
              jobId: job.id
            }
          },
          update: {}, // No change if already exists
          create: {
            candidateId: candidate.id,
            jobId: job.id,
            status: "SHORTLISTED"
          }
        }).catch(() => {}); // ignore errors
      ));
    }

    return NextResponse.json({ message: "Profile updated successfully", candidate, autoShortlisted: matchingJobs.length });
  } catch (error: any) {
    console.error("Profile POST Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
