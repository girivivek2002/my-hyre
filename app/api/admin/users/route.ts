import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const role = searchParams.get("role") || undefined;
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = 20;

  try {
    const where: any = {
      ...(role && role !== "all" ? { role } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({ users, total, page, pages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Admin Users Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "User ID required" }, { status: 400 });
    
    // Deep cascading delete using transaction
    await prisma.$transaction(async (tx: any) => {
      // 1. Get associated profiles
      const candidate = await tx.candidate.findUnique({ where: { userId: id } });
      const recruiter = await tx.recruiter.findUnique({ where: { userId: id } });

      if (candidate) {
        // Find candidate shortlists
        const shortlists = await tx.shortlist.findMany({ 
          where: { candidateId: candidate.id },
          select: { id: true }
        });
        const shortlistIds = shortlists.map((s: any) => s.id);

        // Delete interviews for candidate
        if (shortlistIds.length > 0) {
          await tx.interview.deleteMany({ where: { shortlistId: { in: shortlistIds } } });
        }
        
        // Delete shortlists, messages, resumes
        await tx.shortlist.deleteMany({ where: { candidateId: candidate.id } });
        await tx.message.deleteMany({ where: { candidateId: candidate.id } });
        await tx.candidate.delete({ where: { id: candidate.id } });
      }

      if (recruiter) {
        // Find recruiter jobs
        const jobs = await tx.job.findMany({ 
          where: { recruiterId: recruiter.id },
          select: { id: true }
        });
        const jobIds = jobs.map((j: any) => j.id);

        if (jobIds.length > 0) {
          // Find shortlists for recruiter jobs
          const shortlists = await tx.shortlist.findMany({ 
            where: { jobId: { in: jobIds } },
            select: { id: true }
          });
          const shortlistIds = shortlists.map((s: any) => s.id);

          // Delete interviews for recruiter jobs
          if (shortlistIds.length > 0) {
            await tx.interview.deleteMany({ where: { shortlistId: { in: shortlistIds } } });
          }

          // Delete shortlists for recruiter jobs
          await tx.shortlist.deleteMany({ where: { jobId: { in: jobIds } } });
          
          // Delete recruiter jobs
          await tx.job.deleteMany({ where: { recruiterId: recruiter.id } });
        }

        // Delete recruiter messages
        await tx.message.deleteMany({ where: { recruiterId: recruiter.id } });
        await tx.recruiter.delete({ where: { id: recruiter.id } });
      }

      // 2. Final cleanup of resumes and user
      await tx.resume.deleteMany({ where: { userId: id } });
      await tx.user.delete({ where: { id } });
    });

    return NextResponse.json({ message: "User and all associated data deleted successfully" });
  } catch (error) {
    console.error("Admin Delete Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
