import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@mrhyre.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const JWT_SECRET = (process.env.JWT_SECRET || "super-secret-fallback-key").replace(/['"]+/g, '');

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const token = jwt.sign(
        { id: "admin-id", email: ADMIN_EMAIL, role: "admin", name: "Platform Admin" },
        JWT_SECRET,
        { expiresIn: "7d" }
      );

      const response = NextResponse.json({
        message: "Admin login successful",
        token,
        user: { name: "Platform Admin", email: ADMIN_EMAIL, role: "admin" }
      }, { status: 200 });

      response.cookies.set("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
  } catch (error) {
    console.error("Admin Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
