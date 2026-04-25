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
    
    // Cascade delete shortlists and interviews
    await prisma.shortlist.deleteMany({ where: { jobId: id } });
    await prisma.job.delete({ where: { id } });
    
    return NextResponse.json({ message: "Job deleted" });
  } catch (err) {
    console.error("Admin Job Delete Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
