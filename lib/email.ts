import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendOtpEmail(to: string, otp: string): Promise<boolean> {
  // Gmail credentials missing, skipping actual email send
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    // In development, log only that OTP was generated — NEVER log the OTP value itself
    if (process.env.NODE_ENV === "development") {
      console.log(`[DEV] OTP generated for ${to} — check database for value.`);
    }
    return true;
  }

  try {
    await transporter.sendMail({
      from: `"Mr. Hyre" <${process.env.GMAIL_USER}>`,
      to,
      subject: "Your Mr. Hyre Verification Code",
      html: `
        <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
          <h2 style="color: #4F46E5;">Verify Your Email</h2>
          <p>Your one-time verification code is:</p>
          <div style="background: #F3F4F6; padding: 16px 24px; border-radius: 12px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #111;">
            ${otp}
          </div>
          <p style="color: #6B7280; font-size: 14px; margin-top: 16px;">This code expires in 10 minutes. If you didn't request this, please ignore this email.</p>
        </div>
      `
    });
    return true;
  } catch (error) {
    console.error("Email send error:", error);
    return false;
  }
}

export function generateOtp(): string {
  // Use crypto for stronger randomness when available
  if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    globalThis.crypto.getRandomValues(array);
    return String(100000 + (array[0] % 900000));
  }
  return Math.floor(100000 + Math.random() * 900000).toString();
}
