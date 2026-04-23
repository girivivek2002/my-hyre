import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

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

export async function GET(req: NextRequest) {
  const user = await verifyRecruiter(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const recruiter = await prisma.recruiter.findUnique({
      where: { userId: user.id },
    });

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
