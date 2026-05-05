import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { checkRateLimit } from "@/lib/security";

const JWT_SECRET = (process.env.JWT_SECRET as string).replace(/['"]+/g, '');

// Admin credentials from environment variables — NEVER hardcode in production
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@mrhyre.com";
// Pre-hashed admin password. To generate: node -e "require('bcrypt').hash('YourPassword', 12).then(console.log)"
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH || "";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!checkRateLimit(ip, 3, 60000)) {
      return NextResponse.json({ error: "Too many login attempts. Try again later." }, { status: 429 });
    }

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required." }, { status: 400 });
    }

    // Verify admin credentials
    if (email !== ADMIN_EMAIL) {
      return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
    }

    // Verify password against bcrypt hash (or fallback for initial setup)
    let passwordValid = false;
    if (ADMIN_PASSWORD_HASH && ADMIN_PASSWORD_HASH.startsWith("$2")) {
      passwordValid = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);
    } else {
      // Fallback: env var ADMIN_PASSWORD for initial setup only
      const fallbackPassword = process.env.ADMIN_PASSWORD;
      if (fallbackPassword && password === fallbackPassword) {
        passwordValid = true;
      }
    }

    if (!passwordValid) {
      return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
    }

    const token = jwt.sign(
      { id: "admin-system-id", role: "admin", email, name: "Super Admin" },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    const response = NextResponse.json({ message: "Admin login successful", token });
    
    response.cookies.set("authToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
