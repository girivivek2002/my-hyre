import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import prisma from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

import { cookies } from "next/headers";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID as string,
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET as string,
      client: { client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer" },
      issuer: "https://www.linkedin.com",
      jwks_endpoint: "https://www.linkedin.com/oauth/openid/jwks",
      wellKnown: "https://www.linkedin.com/.well-known/openid-configuration",
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        };
      },
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      if (!user.email) return false;
      
      try {
        const cookieStore = await cookies();
        const selectedRole = cookieStore.get("selectedRole")?.value || "candidate";

        // 5. ACCOUNT LINKING: Detect existing user by email
        let dbUser = await prisma.user.findUnique({ where: { email: user.email } });
        
        if (!dbUser) {
          // New User: Create with OAuth ID and SELECTED ROLE
          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || "OAuth User",
              password: "oauth-placeholder-password",
              role: selectedRole as any,
              googleId: account?.provider === "google" ? account.providerAccountId : null,
              linkedinId: account?.provider === "linkedin" ? account.providerAccountId : null,
            }
          });
        } else {
          // Existing User: Update OAuth ID if missing (Link accounts)
          if (account?.provider === "google" && !dbUser.googleId) {
            await prisma.user.update({
              where: { id: dbUser.id },
              data: { googleId: account.providerAccountId }
            });
          } else if (account?.provider === "linkedin" && !dbUser.linkedinId) {
            await prisma.user.update({
              where: { id: dbUser.id },
              data: { linkedinId: account.providerAccountId }
            });
          }
        }
        return true;
      } catch (error) {
        console.error("OAuth Synthesis Error:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user || !token.role) {
        const dbUser = await prisma.user.findUnique({ 
          where: { email: token.email! },
          include: { candidateProfile: true, recruiterProfile: true }
        });
        
        if (dbUser) {
          token.customJwt = jwt.sign(
            { id: dbUser.id, role: dbUser.role, email: dbUser.email },
            JWT_SECRET,
            { expiresIn: "7d" }
          );
          token.role = dbUser.role;
          token.userId = dbUser.id;
          token.isVerified = dbUser.isVerified;

          // Check completeness (Logic for redirection)
          let isComplete = false;
          if (dbUser.role === "candidate") {
            isComplete = !!(dbUser.candidateProfile);
          } else if (dbUser.role === "recruiter") {
            isComplete = !!(dbUser.recruiterProfile);
          }
          token.isProfileComplete = isComplete;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        (session as any).user.id = token.userId;
        (session as any).customJwt = token.customJwt;
        (session as any).userRole = token.role;
        (session as any).isVerified = token.isVerified;
        (session as any).isProfileComplete = token.isProfileComplete;
      }
      return session;
    }
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
    newUser: "/complete-profile" // Redirect new OAuth users here
  }
});

export { handler as GET, handler as POST };
