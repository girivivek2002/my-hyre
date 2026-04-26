import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyCandidate } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const candidateUser = await verifyCandidate(req);
  if (!candidateUser) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const candidateId = candidateUser.profile.id;

    const [
      activeApplications,
      interviewsCount,
      resumeNodes,
      profileStrength
    ] = await Promise.all([
      prisma.shortlist.count({ where: { candidateId } }),
      prisma.interview.count({ where: { shortlist: { candidateId } } }),
      prisma.resume.count({ where: { userId: candidateUser.id } }),
      // Simple profile strength calculation
      Promise.resolve(
        (candidateUser.profile.phone ? 20 : 0) +
        (candidateUser.profile.skills.length > 0 ? 30 : 0) +
        (candidateUser.profile.biography ? 20 : 0) +
        (candidateUser.profile.experience ? 30 : 0)
      )
    ]);

    const recentShortlists = await prisma.shortlist.findMany({
      where: { candidateId },
      take: 5,
      orderBy: { updatedAt: "desc" },
      include: { job: true }
    });

    return NextResponse.json({
      stats: {
        activeApplications,
        interviewsCount,
        resumeNodes,
        profileStrength,
      },
      recentShortlists
    });
  } catch (error) {
    console.error("Candidate Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
