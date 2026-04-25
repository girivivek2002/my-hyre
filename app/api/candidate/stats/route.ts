import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyCandidate } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const candidateUser = await verifyCandidate(req);
  if (!candidateUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const candidateId = candidateUser.profile.id;

    const [
      totalCitizens,
      activeJobs,
      resumeNodes,
      waitlistCount,
      recentShortlists
    ] = await Promise.all([
      prisma.user.count({ where: { role: "candidate" } }),
      prisma.shortlist.count({ where: { candidateId } }),
      prisma.resume.count({ where: { userId: candidateUser.id } }),
      prisma.waitlist.count(),
      prisma.shortlist.findMany({
        where: { candidateId },
        take: 5,
        orderBy: { updatedAt: "desc" },
        include: { job: true }
      })
    ]);

    return NextResponse.json({
      stats: {
        totalCitizens,
        activeJobs,
        resumeNodes,
        waitlistCount,
      },
      recentShortlists
    });
  } catch (error) {
    console.error("Candidate Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
