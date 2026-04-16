import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@mrhyre.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-fallback-key";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { id: "admin-id", email: ADMIN_EMAIL, role: "admin" },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      return NextResponse.json({
        message: "Admin login successful",
        token,
        user: { name: "Platform Admin", email: ADMIN_EMAIL, role: "admin" }
      }, { status: 200 });
    }

    return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
  } catch (error) {
    console.error("Admin Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
