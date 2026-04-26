import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/db";
import { sendOtpEmail, generateOtp } from "@/lib/email";
import { checkRateLimit, isDisposableEmail } from "@/lib/security";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please wait a minute before trying again." },
        { status: 429 }
      );
    }

    const { email } = await req.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Block disposable emails
    if (isDisposableEmail(cleanEmail)) {
      return NextResponse.json(
        { error: "Please use a legitimate email address." },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: cleanEmail },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "This email is already registered. Please log in instead." },
        { status: 400 }
      );
    }

    // Delete any existing OTPs for this email
    await prisma.otpVerification.deleteMany({
      where: { email: cleanEmail },
    });

    // Generate and store new OTP
    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.otpVerification.create({
      data: {
        email: cleanEmail,
        otp,
        expiresAt,
      },
    });

    // Send OTP via email
    const sent = await sendOtpEmail(cleanEmail, otp);

    if (!sent) {
      return NextResponse.json(
        { error: "Failed to send verification email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Verification code sent to your email." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Send OTP Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
