import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      include: { recruiter: true }
    });
    return NextResponse.json({ jobs });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Job ID required" }, { status: 400 });
    
    // Deep cascading delete using transaction
    await prisma.$transaction(async (tx: any) => {
      // 1. Find all shortlists associated with this job
      const shortlists = await tx.shortlist.findMany({
        where: { jobId: id },
        select: { id: true }
      });
      const shortlistIds = shortlists.map((s: any) => s.id);

      // 2. Delete all interviews linked to these shortlists
      if (shortlistIds.length > 0) {
        await tx.interview.deleteMany({
          where: { shortlistId: { in: shortlistIds } }
        });
      }

      // 3. Delete shortlists
      await tx.shortlist.deleteMany({ where: { jobId: id } });

      // 4. Delete the job itself
      await tx.job.delete({ where: { id } });
    });
    
    return NextResponse.json({ message: "Job deleted successfully" });
  } catch (err) {
    console.error("Admin Job Delete Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
