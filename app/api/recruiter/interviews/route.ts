import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyRecruiter } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET: Fetch all interviews for the recruiter's jobs
 */
export async function GET(req: NextRequest) {
  const recruiter = await verifyRecruiter(req);
  if (!recruiter) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const interviews = await prisma.interview.findMany({
      where: {
        shortlist: {
          job: {
            recruiterId: recruiter.profile.id
          }
        }
      },
      include: {
        shortlist: {
          include: {
            candidate: true,
            job: true
          }
        }
      },
      orderBy: { date: "asc" }
    });

    return NextResponse.json({ interviews });
  } catch (error) {
    console.error("Recruiter Interviews GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * POST: Schedule an interview
 */
export async function POST(req: NextRequest) {
  const recruiter = await verifyRecruiter(req);
  if (!recruiter) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
    const { shortlistId, date, time, platform } = await req.json();
    console.log("[POST /api/recruiter/interviews] Received:", { shortlistId, date, time, platform });
    
    if (!shortlistId) return NextResponse.json({ error: "Missing shortlistId" }, { status: 400 });

    // Verify ownership: shortlist -> job -> recruiterId
    const shortlist = await prisma.shortlist.findUnique({
      where: { id: shortlistId },
      include: { job: true }
    });

    if (!shortlist || shortlist.job.recruiterId !== recruiter.profile.id) {
      console.error("[POST /api/recruiter/interviews] Verification failed:", { 
        found: !!shortlist, 
        owner: shortlist?.job?.recruiterId, 
        caller: recruiter.profile.id 
      });
      return NextResponse.json({ error: "Shortlist not found or access denied" }, { status: 403 });
    }

    let finalPlatform = platform || "Google Meet";
    if (finalPlatform === "Google Meet") {
      // Generate a random-looking meet link: meet.google.com/abc-defg-hij
      const part1 = Math.random().toString(36).substring(2, 5);
      const part2 = Math.random().toString(36).substring(2, 6);
      const part3 = Math.random().toString(36).substring(2, 5);
      finalPlatform = `meet.google.com/${part1}-${part2}-${part3}`;
    }

    const existingInterview = await prisma.interview.findFirst({
      where: { shortlistId }
    });

    let interview;
    if (existingInterview) {
      interview = await prisma.interview.update({
        where: { id: existingInterview.id },
        data: {
          date: date ? new Date(date) : undefined,
          time,
          platform: finalPlatform,
          status: "SCHEDULED"
        }
      });
    } else {
      interview = await prisma.interview.create({
        data: {
          shortlistId,
          date: date ? new Date(date) : undefined,
          time,
          platform: finalPlatform,
          status: "SCHEDULED"
        }
      });
    }

    return NextResponse.json({ interview });
  } catch (error) {
    console.error("Recruiter Interviews POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
