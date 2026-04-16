import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-fallback-key";

function verifyAdmin(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  try {
    const decoded: any = jwt.verify(auth.split(" ")[1], JWT_SECRET);
    return decoded.role === "admin";
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) {
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
