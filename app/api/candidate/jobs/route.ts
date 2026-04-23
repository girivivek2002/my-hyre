import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";
import { calculateCandidateMatch } from "@/lib/ai-matcher";

export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-fallback-key";

async function getCandidateIdFromUser(userId: string) {
  const candidate = await prisma.candidate.findUnique({
    where: { userId },
  });
  return candidate?.id;
}

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const decoded: any = jwt.verify(auth.split(" ")[1], JWT_SECRET);
    if (decoded.role !== "candidate") return NextResponse.json({ error: "Access Denied" }, { status: 403 });

    const candidateId = await getCandidateIdFromUser(decoded.id);
    if (!candidateId) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
    });

    if (!candidate) return NextResponse.json({ error: "Profile not found" }, { status: 404 });

    const shortlists = await prisma.shortlist.findMany({
      where: { candidateId },
      include: {
        job: {
          include: {
            recruiter: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

    // Formatting for the extraordinary frontend with dynamic AI matching
    const formattedJobs = await Promise.all(
      shortlists.map(async (s: any) => {
        const matchResult = await calculateCandidateMatch(
          {
            skills: candidate.skills,
            biography: candidate.biography,
            experience: candidate.experience
          },
          {
            title: s.job.title,
            skills: s.job.skills,
            description: s.job.description
          }
        );

        return {
          id: s.id,
          jobId: s.job.id,
          company: s.job.recruiter.companyName,
          role: s.job.title,
          location: s.job.location,
          salary: s.job.salary,
          match: matchResult.score,
          type: s.job.type,
          experience: s.job.experience,
          tags: s.job.skills,
          description: s.job.description,
          logo: s.job.recruiter.companyName[0],
          status: s.status
        };
      })
    );

    return NextResponse.json({ jobs: formattedJobs });
  } catch (error) {
    console.error("Candidate Jobs Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
