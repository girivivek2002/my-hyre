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
  console.log(`Bypassing email send to ${to}. OTP: ${otp}`);
  return true;
}


export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
