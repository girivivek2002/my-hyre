import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";

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

    const [
      totalCitizens,
      activeJobs,
      resumeNodes,
      waitlistCount,
      recentShortlists
    ] = await Promise.all([
      prisma.user.count({ where: { role: "candidate" } }),
      prisma.shortlist.count({ where: { candidateId } }),
      prisma.resume.count({ where: { userId: decoded.id } }),
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
