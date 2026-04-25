import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { getSession, verifyRecruiter, verifyCandidate } from "@/lib/auth";

export const dynamic = "force-dynamic";

/**
 * GET: Fetch conversations or specific message threads
 */
export async function GET(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const targetId = searchParams.get("targetId"); // Candidate ID if recruiter, Recruiter ID if candidate

  try {
    if (session.role === "recruiter") {
      const recruiter = await verifyRecruiter(req);
      if (!recruiter) return NextResponse.json({ error: "Recruiter profile not found" }, { status: 404 });

      if (targetId) {
        // Fetch specific thread with a candidate
        const messages = await prisma.message.findMany({
          where: {
            recruiterId: recruiter.profile.id,
            candidateId: targetId
          },
          orderBy: { createdAt: "asc" }
        });
        return NextResponse.json({ messages });
      } else {
        // Fetch all conversations (unique candidates)
        const messages = await prisma.message.findMany({
          where: { recruiterId: recruiter.profile.id },
          distinct: ['candidateId'],
          include: { candidate: true },
          orderBy: { createdAt: "desc" }
        });
        return NextResponse.json({ conversations: messages });
      }
    } else if (session.role === "candidate") {
      const candidate = await verifyCandidate(req);
      if (!candidate) return NextResponse.json({ error: "Candidate profile not found" }, { status: 404 });

      if (targetId) {
        // Fetch specific thread with a recruiter
        const messages = await prisma.message.findMany({
          where: {
            candidateId: candidate.profile.id,
            recruiterId: targetId
          },
          orderBy: { createdAt: "asc" }
        });
        return NextResponse.json({ messages });
      } else {
        // Fetch all conversations (unique recruiters)
        const messages = await prisma.message.findMany({
          where: { candidateId: candidate.profile.id },
          distinct: ['recruiterId'],
          include: { recruiter: true },
          orderBy: { createdAt: "desc" }
        });
        return NextResponse.json({ conversations: messages });
      }
    }

    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  } catch (error) {
    console.error("Messages GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

/**
 * POST: Send a message
 */
export async function POST(req: NextRequest) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { content, targetId } = await req.json();
    if (!content || !targetId) return NextResponse.json({ error: "Missing content or targetId" }, { status: 400 });

    let recruiterId: string;
    let candidateId: string;
    let senderType: string;

    if (session.role === "recruiter") {
      const recruiter = await verifyRecruiter(req);
      if (!recruiter) return NextResponse.json({ error: "Recruiter profile not found" }, { status: 404 });
      recruiterId = recruiter.profile.id;
      candidateId = targetId;
      senderType = "RECRUITER";
    } else if (session.role === "candidate") {
      const candidate = await verifyCandidate(req);
      if (!candidate) return NextResponse.json({ error: "Candidate profile not found" }, { status: 404 });
      candidateId = candidate.profile.id;
      recruiterId = targetId;
      senderType = "CANDIDATE";
    } else {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        content,
        senderType,
        recruiterId,
        candidateId
      }
    });

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Messages POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
