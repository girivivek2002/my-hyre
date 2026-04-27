import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyCandidate } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const candidateUser = await verifyCandidate(req, { strict: false });
  if (!candidateUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const profile = await prisma.candidate.findUnique({
      where: { userId: candidateUser.id }
    });
    return NextResponse.json({ profile });
  } catch (error) {
    console.error("Profile GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const candidateUser = await verifyCandidate(req, { strict: false });
  if (!candidateUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const data = await req.json();

    // Map frontend fields to database fields
    const skillsArray = typeof data.skills === 'string' 
      ? data.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
      : Array.isArray(data.skills) ? data.skills : [];

    const candidate = await prisma.candidate.upsert({
      where: { userId: candidateUser.id },
      update: {
        userId: candidateUser.id,
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
        userId: candidateUser.id,
        name: data.name,
        email: candidateUser.email || "",
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
    // If a candidate updates their profile, find jobs that match their desired role or skills
    const matchingJobs = await prisma.job.findMany({
      where: {
        title: { contains: candidate.role || "", mode: 'insensitive' }
      },
      take: 5
    });

    if (matchingJobs.length > 0) {
      await Promise.all(
        matchingJobs.map((job: any) =>
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
        )
      );
    }

    return NextResponse.json({ message: "Profile updated successfully", candidate, autoShortlisted: matchingJobs.length });
  } catch (error: any) {
    console.error("Profile POST Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
