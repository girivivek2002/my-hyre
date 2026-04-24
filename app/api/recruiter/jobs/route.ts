import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { canRecruiterPost } from "@/lib/security";
import { verifyRecruiter } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await verifyRecruiter(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const jobs = await prisma.job.findMany({
      where: { recruiterId: user.profile.id },
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
  const user = await verifyRecruiter(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // 3. RECRUITER VERIFICATION CHECK
  if (!canRecruiterPost(user, user.profile)) {
    return NextResponse.json({ 
      error: "Verification Required", 
      message: `Account verification needed. Status: User(${user.isVerified ? 'Verified' : 'Unverified'}), Recruiter(${user.profile.isVerified ? 'Verified' : 'Unverified'}). Please use a company email or contact support.`,
      debug: {
        userVerified: user.isVerified,
        profileVerified: user.profile.isVerified,
        email: user.email,
        role: user.role
      }
    }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { title, location, salary, type, experience, description, skills } = body;

    if (!title) {
      return NextResponse.json({ error: "Job title is required" }, { status: 400 });
    }

    const job = await prisma.job.create({
      data: {
        title,
        company: user.profile.companyName,
        location: location || "Remote",
        salary: salary || "Competitive",
        type: type || "Full-time",
        experience: experience || "Any",
        description: description || `Join ${user.profile.companyName} as a ${title}.`,
        skills: Array.isArray(skills) ? skills : (skills ? String(skills).split(",").map((s: string) => s.trim()) : []),
        recruiterId: user.profile.id,
      },
    });

    // AUTO-SHORTLIST LOGIC (Existing)
    const jobSkills = Array.isArray(skills) ? skills : (skills ? String(skills).split(",").map((s: string) => s.trim()) : []);
    const titleKeywords = title.split(/[\s-]+/).filter((k: string) => k.length > 2);
    const searchTerms = Array.from(new Set([title, ...jobSkills]));
    
    const matchingCandidates = await prisma.candidate.findMany({
      where: {
        OR: [
          { role: { contains: title, mode: 'insensitive' } },
          { skills: { hasSome: searchTerms } },
          ...titleKeywords.map((k: string) => ({ role: { contains: k, mode: 'insensitive' as const } })),
        ]
      },
      take: 10
    });

    if (matchingCandidates.length > 0) {
      await Promise.all(matchingCandidates.map((candidate: any) => 
        prisma.shortlist.upsert({
          where: {
            candidateId_jobId: { candidateId: candidate.id, jobId: job.id }
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
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
