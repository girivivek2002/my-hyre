import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = (process.env.JWT_SECRET as string || "").replace(/['"]+/g, '');

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    // Verify hardcoded admin credentials
    if (email === "admin@mrhyre.com" && password === "Mr.hyre#2026@") {
      const token = jwt.sign(
        { id: "admin-system-id", role: "admin", email, name: "Super Admin" },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      const response = NextResponse.json({ message: "Admin login successful", token });
      
      // Set secure cookie
      response.cookies.set("authToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 24 * 60 * 60, // 1 day
        path: "/",
      });

      return response;
    }

    return NextResponse.json({ error: "Invalid admin credentials" }, { status: 401 });
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
