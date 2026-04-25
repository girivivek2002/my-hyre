import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const resumes = await prisma.resume.findMany({
      orderBy: { createdAt: "desc" },
      include: { user: true }
    });
    return NextResponse.json({ resumes });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await verifyAdmin(req);
  if (!admin) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "Resume ID required" }, { status: 400 });
    
    await prisma.resume.delete({ where: { id } });
    return NextResponse.json({ message: "Resume deleted" });
  } catch (err) {
    console.error("Admin Resume Delete Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
