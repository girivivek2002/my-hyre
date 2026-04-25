import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [
      totalUsers,
      totalCandidates,
      totalRecruiters,
      totalJobs,
      totalShortlists,
      totalMessages,
      totalResumes,
      totalWaitlist,
      recentUsers,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: "candidate" } }),
      prisma.user.count({ where: { role: "recruiter" } }),
      prisma.job.count(),
      prisma.shortlist.count(),
      prisma.message.count(),
      prisma.resume.count(),
      prisma.waitlist.count(),
      prisma.user.findMany({
        take: 10,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
    ]);

    return NextResponse.json({
      stats: {
        totalUsers,
        totalCandidates,
        totalRecruiters,
        totalJobs,
        totalShortlists,
        totalMessages,
        totalResumes,
        totalWaitlist,
      },
      recentUsers,
    });
  } catch (error) {
    console.error("Admin Stats Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
