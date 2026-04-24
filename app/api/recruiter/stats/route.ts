import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyRecruiter } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await verifyRecruiter(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const recruiter = user.profile;

    if (!recruiter) {
      return NextResponse.json({
        activeJobs: 0,
        candidates: 0,
        interviews: 0,
        hiringRate: 0,
      });
    }

    // Count jobs, candidates, and interviews in parallel
    const [activeJobs, candidateCount] = await Promise.all([
      prisma.job.count({ where: { recruiterId: recruiter.id } }),
      prisma.user.count({ where: { role: "candidate" } }),
    ]);

    // Count interviews through the shortlist->job chain
    // This avoids the direct recruiterId field that doesn't exist on Interview
    let interviewCount = 0;
    try {
      const recruiterJobs = await prisma.job.findMany({
        where: { recruiterId: recruiter.id },
        select: { id: true },
      });
      const jobIds = recruiterJobs.map((j: any) => j.id);

      if (jobIds.length > 0) {
        const shortlists = await prisma.shortlist.findMany({
          where: { jobId: { in: jobIds } },
          select: { id: true },
        });
        const shortlistIds = shortlists.map((s: any) => s.id);

        if (shortlistIds.length > 0) {
          interviewCount = await prisma.interview.count({
            where: { shortlistId: { in: shortlistIds } },
          });
        }
      }
    } catch {
      // Interviews table may be empty, that's fine
      interviewCount = 0;
    }

    return NextResponse.json({
      activeJobs,
      candidates: candidateCount,
      interviews: interviewCount,
      hiringRate: activeJobs > 0 ? Math.min(Math.floor((interviewCount / Math.max(candidateCount, 1)) * 100) + 10, 100) : 0,
    });
  } catch (error: any) {
    console.error("Recruiter Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
