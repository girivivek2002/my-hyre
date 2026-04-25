import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyCandidate } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const candidate = await verifyCandidate(req);
  if (!candidate) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const interviews = await prisma.interview.findMany({
      where: {
        shortlist: {
          candidateId: candidate.profile.id
        }
      },
      include: {
        shortlist: {
          include: {
            job: {
              include: {
                recruiter: true
              }
            }
          }
        }
      },
      orderBy: { date: "asc" }
    });

    const formattedInterviews = interviews.map((i: any) => ({
      id: i.id,
      company: i.shortlist.job.recruiter.companyName || "Partner",
      role: i.shortlist.job.title,
      date: i.date ? new Date(i.date).toLocaleDateString() : "To be scheduled",
      time: i.time || "TBD",
      type: i.status === "SCHEDULED" ? "Initial Screening" : "Deep Dive",
      interviewer: i.shortlist.job.recruiter.name || "Hiring Manager",
      platform: i.platform || "Video Hub",
      status: i.status,
      prep: [
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
