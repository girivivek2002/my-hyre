import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession() as any;
    if (!session || session.userRole !== "admin") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { userId, isVerified } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Update user and recruiter profile
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { isVerified },
      include: { recruiterProfile: true }
    });

    if (updatedUser.recruiterProfile) {
      await prisma.recruiter.update({
        where: { id: updatedUser.recruiterProfile.id },
        data: { isVerified }
      });
    }

    return NextResponse.json({ success: true, isVerified });
  } catch (error) {
    console.error("Admin verification API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
