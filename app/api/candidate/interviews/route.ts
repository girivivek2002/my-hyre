import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";

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

    const interviews = await prisma.interview.findMany({
      where: {
        shortlist: {
          candidateId
        }
      },
      include: {
        shortlist: {
          include: {
            job: true
          }
        }
      },
      orderBy: { date: "asc" }
    });

    const formattedInterviews = interviews.map((i: any) => ({
      id: i.id,
      company: i.shortlist.job.company,
      role: i.shortlist.job.title,
      date: i.date?.toLocaleDateString() || "To be scheduled",
      time: i.time || "TBD",
      type: i.status === "SCHEDULED" ? "Initial Screening" : "Deep Dive",
      interviewer: i.interviewerName || "System Assigned",
      title: i.interviewerTitle || "Recruitment Manager",
      platform: i.platform || "Video Hub",
      status: i.status,
      prep: i.prepNotes.length > 0 ? i.prepNotes : [
        "Review company products",
        "Analyze role architecture",
        "Prepare technical questions"
      ]
    }));

    return NextResponse.json({ interviews: formattedInterviews });
  } catch (error) {
    console.error("Candidate Interviews Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
