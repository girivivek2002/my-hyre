import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { checkRateLimit } from "@/lib/security";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@mrhyre.com";
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";
const JWT_SECRET = (process.env.JWT_SECRET || "").replace(/['"]+/g, '');

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!checkRateLimit(ip, 3, 60000)) {
      return NextResponse.json({ error: "Too many login attempts." }, { status: 429 });
    }

    const body = await req.json();
    const { email, password } = body;

    if (email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
    }

    let passwordValid = false;
    if (ADMIN_PASSWORD_HASH && ADMIN_PASSWORD_HASH.startsWith("$2")) {
      passwordValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    } else {
      const fallbackPassword = process.env.ADMIN_PASSWORD;
      if (fallbackPassword && password === fallbackPassword) {
        passwordValid = true;
      }
    }

    if (!passwordValid) {
      return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
    }

    const token = jwt.sign(
      { id: "admin-id", email: ADMIN_EMAIL, role: "admin", name: "Platform Admin" },
      JWT_SECRET,
      { expiresIn: "1d" }
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
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
