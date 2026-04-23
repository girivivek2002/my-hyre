import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import prisma from "@/lib/db";

export async function POST(req: Request) {
  try {
    const session = await getServerSession() as any;
    if (!session || !session.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { role } = await req.json();

    if (!role || !["candidate", "recruiter"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 });
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { role: role as any },
    });

    // Create empty profile placeholders based on role
    if (role === "candidate") {
      await prisma.candidate.upsert({
        where: { email: session.user.email },
        update: { userId: updatedUser.id },
        create: {
          userId: updatedUser.id,
          email: session.user.email,
          name: session.user.name || "OAuth Candidate",
        }
      });
    } else if (role === "recruiter") {
      await prisma.recruiter.upsert({
        where: { email: session.user.email },
        update: { userId: updatedUser.id },
        create: {
          userId: updatedUser.id,
          email: session.user.email,
          name: session.user.name || "OAuth Recruiter",
          companyName: "Pending Setup",
        }
      });
    }

    return NextResponse.json({ success: true, role });
  } catch (error) {
    console.error("Profile completion API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
