import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { calculateCandidateMatch } from "@/lib/ai-matcher";
import { verifyCandidate } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const candidateUser = await verifyCandidate(req);
  if (!candidateUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const candidate = candidateUser.profile;

    const shortlists = await prisma.shortlist.findMany({
      where: { candidateId: candidate.id },
      include: {
        job: {
          include: {
            recruiter: true
          }
        }
      },
      orderBy: { createdAt: "desc" }
    });

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
          company: s.job.recruiter.companyName || "Partner",
          role: s.job.title,
          location: s.job.location,
          salary: s.job.salary,
          match: matchResult.score,
          type: s.job.type,
          experience: s.job.experience,
          tags: s.job.skills,
          description: s.job.description,
          logo: (s.job.recruiter.companyName || "P")[0],
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
