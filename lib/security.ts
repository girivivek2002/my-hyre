import { NextResponse } from "next/server";

// Rate limiting state (In-memory, for production use Redis/Upstash)
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export function checkRateLimit(ip: string, limit = 5, windowMs = 60000) {
  const now = Date.now();
  const userData = rateLimitMap.get(ip) || { count: 0, lastReset: now };

  if (now - userData.lastReset > windowMs) {
    userData.count = 1;
    userData.lastReset = now;
  } else {
    userData.count++;
  }

  rateLimitMap.set(ip, userData);
  return userData.count <= limit;
}

// Disposable email domains to block
const DISPOSABLE_DOMAINS = [
  "mailinator.com", "guerrillamail.com", "10minutemail.com", 
  "temp-mail.org", "yopmail.com", "sharklasers.com"
];

export function isDisposableEmail(email: string) {
  const domain = email.split("@")[1]?.toLowerCase();
  return DISPOSABLE_DOMAINS.includes(domain);
}

// Recruiter Verification Logic (Production Grade)
export function canRecruiterPost(user: any, recruiterProfile: any) {
  /**
   * REAL SOLUTION:
   * 1. Check if the user has an 'admin' role (Platform Owners/Staff)
   * 2. Check if the 'isVerified' flag is true in either User or Recruiter model (Manual/Verified accounts)
   * 3. Check if the company email belongs to a corporate domain (Auto-verification)
   */

  // 1. Admin Bypass
  if (user.role === 'admin') return true;

  // 2. Database Verification Check (Manual Approval or System Verified)
  if (user.isVerified === true || recruiterProfile?.isVerified === true) {
    return true;
  }
  
  // 3. Corporate Email Domain Auto-Verification
  const email = recruiterProfile?.companyEmail || recruiterProfile?.email || user.email;
  if (!email) return false;
  
  const emailDomain = email.split("@")[1]?.toLowerCase();
  const publicDomains = [
    "gmail.com", "yahoo.com", "outlook.com", "hotmail.com", 
    "icloud.com", "me.com", "live.com", "rediffmail.com", "yandex.com"
  ];
  
  if (emailDomain && !publicDomains.includes(emailDomain)) {
    // If it's a custom domain, we assume it's a corporate email and allow posting
    return true;
  }

  // 4. Default: Require Manual Verification for public email accounts
  // This is the secure default for a production-grade system.
  return false; 
}

// CAPTCHA Verification (Stub for Google reCAPTCHA)
export async function verifyCaptcha(token: string) {
  if (process.env.NODE_ENV === "development") return true;
  
  const res = await fetch(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET}&response=${token}`, {
    method: "POST"
  });
  const data = await res.json();
  return data.success;
}
