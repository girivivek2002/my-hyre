import { NextResponse } from "next/server";
import prisma from "@/lib/db";

export async function GET() {
  try {
    const keys = Object.keys(prisma);
    return NextResponse.json({ 
      allKeys: keys.join(", "),
      hasLowerCaseUser: 'user' in prisma,
      hasUpperCaseUser: 'User' in prisma,
      hasLowerCaseCandidate: 'candidate' in prisma,
      hasUpperCaseCandidate: 'Candidate' in prisma,
      modelCount: keys.filter(k => !k.startsWith('$') && !k.startsWith('_')).length
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
