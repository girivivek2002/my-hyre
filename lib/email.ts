import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendOtpEmail(to: string, otp: string): Promise<boolean> {
  try {
    await transporter.sendMail({
      from: `"Mr. Hyre" <${process.env.GMAIL_USER}>`,
      to,
      subject: `${otp} is your Mr. Hyre verification code`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin:0;padding:0;background-color:#f8fafc;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
          <div style="max-width:480px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
            
            <!-- Header -->
            <div style="background:linear-gradient(135deg,#0f172a 0%,#1e293b 100%);padding:32px 32px 28px;text-align:center;">
              <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:800;letter-spacing:-0.5px;">Mr. Hyre</h1>
              <p style="margin:8px 0 0;color:#94a3b8;font-size:12px;text-transform:uppercase;letter-spacing:2px;font-weight:600;">Email Verification</p>
            </div>
            
            <!-- Body -->
            <div style="padding:40px 32px;text-align:center;">
              <p style="color:#475569;font-size:15px;line-height:1.6;margin:0 0 28px;">
                Use the verification code below to complete your account registration. This code expires in <strong>10 minutes</strong>.
              </p>
              
              <!-- OTP Code -->
              <div style="background:linear-gradient(135deg,#f1f5f9,#e2e8f0);border-radius:12px;padding:24px;margin:0 auto 28px;max-width:260px;">
                <span style="font-size:36px;font-weight:800;letter-spacing:12px;color:#0f172a;font-family:'Courier New',monospace;">${otp}</span>
              </div>
              
              <p style="color:#94a3b8;font-size:13px;margin:0;">
                If you didn't request this code, you can safely ignore this email.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background:#f8fafc;border-top:1px solid #e2e8f0;padding:20px 32px;text-align:center;">
              <p style="margin:0;color:#94a3b8;font-size:11px;text-transform:uppercase;letter-spacing:1px;font-weight:600;">
                © ${new Date().getFullYear()} Mr. Hyre AI · Secure Hiring Platform
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
}

export function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}
