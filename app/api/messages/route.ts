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
        // targetId might be a User ID. Resolve to Candidate ID.
        let resolvedCandidateId = targetId;
        const candidateProfile = await prisma.candidate.findFirst({
          where: { OR: [{ userId: targetId }, { id: targetId }] }
        });
        if (candidateProfile) resolvedCandidateId = candidateProfile.id;

        const messages = await prisma.message.findMany({
          where: {
            recruiterId: recruiter.profile.id,
            candidateId: resolvedCandidateId
          },
          orderBy: { createdAt: "asc" }
        });
        return NextResponse.json({ messages });
      } else {
        const messages = await prisma.message.findMany({
          where: { recruiterId: recruiter.profile.id },
          distinct: ['candidateId'],
          include: { candidate: true },
          orderBy: { createdAt: "desc" }
        });
        
        // Map candidate profiles back to User-like shapes for the frontend if needed
        const mappedConversations = messages.map((msg: any) => ({
          ...msg,
          candidate: {
            ...msg.candidate,
            id: msg.candidate.userId || msg.candidate.id // Pass User ID so UI works
          }
        }));
        
        return NextResponse.json({ conversations: mappedConversations });
      }
    } else if (session.role === "candidate") {
      const candidate = await verifyCandidate(req);
      if (!candidate) return NextResponse.json({ error: "Candidate profile not found" }, { status: 404 });

      if (targetId) {
        // Resolve targetId to Recruiter Profile ID
        let resolvedRecruiterId = targetId;
        const recruiterProfile = await prisma.recruiter.findFirst({
          where: { OR: [{ userId: targetId }, { id: targetId }] }
        });
        if (recruiterProfile) resolvedRecruiterId = recruiterProfile.id;

        const messages = await prisma.message.findMany({
          where: {
            candidateId: candidate.profile.id,
            recruiterId: resolvedRecruiterId
          },
          orderBy: { createdAt: "asc" }
        });
        return NextResponse.json({ messages });
      } else {
        const messages = await prisma.message.findMany({
          where: { candidateId: candidate.profile.id },
          distinct: ['recruiterId'],
          include: { recruiter: true },
          orderBy: { createdAt: "desc" }
        });
        
        const mappedConversations = messages.map((msg: any) => ({
          ...msg,
          recruiter: {
            ...msg.recruiter,
            id: msg.recruiter.userId || msg.recruiter.id
          }
        }));

        return NextResponse.json({ conversations: mappedConversations });
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
      
      // Resolve Candidate ID
      let resolvedCandidateId = targetId;
      const candidateProfile = await prisma.candidate.findFirst({
        where: { OR: [{ userId: targetId }, { id: targetId }] }
      });
      if (candidateProfile) resolvedCandidateId = candidateProfile.id;
      
      candidateId = resolvedCandidateId;
      senderType = "RECRUITER";
    } else if (session.role === "candidate") {
      const candidate = await verifyCandidate(req);
      if (!candidate) return NextResponse.json({ error: "Candidate profile not found" }, { status: 404 });
      
      candidateId = candidate.profile.id;
      
      // Resolve Recruiter ID
      let resolvedRecruiterId = targetId;
      const recruiterProfile = await prisma.recruiter.findFirst({
        where: { OR: [{ userId: targetId }, { id: targetId }] }
      });
      if (recruiterProfile) resolvedRecruiterId = recruiterProfile.id;
      
      recruiterId = resolvedRecruiterId;
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
