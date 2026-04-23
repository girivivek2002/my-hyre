import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";

export const dynamic = "force-dynamic";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-fallback-key";

function verifyAdmin(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return false;
  try {
    const decoded: any = jwt.verify(auth.split(" ")[1], JWT_SECRET);
    return decoded.role === "admin";
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

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
  if (!verifyAdmin(req)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = await req.json();
    await prisma.job.delete({ where: { id } });
    return NextResponse.json({ message: "Job deleted" });
  } catch (err) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
