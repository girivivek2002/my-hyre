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
    
    // Cascading delete safety
    await prisma.resume.deleteMany({ where: { userId: id } });
    await prisma.candidate.deleteMany({ where: { userId: id } });
    await prisma.recruiter.deleteMany({ where: { userId: id } });
    
    await prisma.user.delete({ where: { id } });
    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Admin Delete Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
