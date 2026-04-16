import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import prisma from "@/lib/db";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-fallback-key";

export async function GET(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const decoded: any = jwt.verify(auth.split(" ")[1], JWT_SECRET);
  } catch (error) {
    console.error("Profile GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Bearer ")) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
  try {
    const decoded: any = jwt.verify(auth.split(" ")[1], JWT_SECRET);
    const data = await req.json();

    const candidate = await prisma.candidate.upsert({
      where: { userId: decoded.id },
      update: {
        name: data.name,
        role: data.role,
        experience: data.experience,
        biography: data.biography,
        location: data.location,
        workPreference: data.workPreference,
        salaryExpectation: data.salaryExpectation,
        noticePeriod: data.noticePeriod,
        skills: data.skills,
      },
      create: {
        userId: decoded.id,
        name: data.name,
        email: decoded.email,
        role: data.role,
        experience: data.experience,
        biography: data.biography,
        location: data.location,
        workPreference: data.workPreference,
        salaryExpectation: data.salaryExpectation,
        noticePeriod: data.noticePeriod,
        skills: data.skills,
      }
    });

    return NextResponse.json({ message: "Profile updated successfully", candidate });
  } catch (error) {
    console.error("Profile POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
