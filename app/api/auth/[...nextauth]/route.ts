import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import LinkedInProvider from "next-auth/providers/linkedin";
import prisma from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "super-secret-fallback-key";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "dummy-google-client-id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "dummy-google-client-secret",
    }),
    LinkedInProvider({
      clientId: process.env.LINKEDIN_CLIENT_ID || "dummy-linkedin-client-id",
      clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "dummy-linkedin-client-secret",
    })
  ],
  secret: process.env.NEXTAUTH_SECRET || "dummy-nextauth-secret-key-1234",
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return false;
      
      try {
        let dbUser = await prisma.user.findUnique({ where: { email: user.email } });
        
        if (!dbUser) {
          // Auto-create User Node
          dbUser = await prisma.user.create({
            data: {
              email: user.email,
              name: user.name || "OAuth User",
              password: "oauth-placeholder-password", // System handles this
              role: "candidate", // Default to candidate for OAuth
            }
          });
          
          // Auto-create Candidate Profile 
          await prisma.candidate.create({
            data: {
              userId: dbUser.id,
              name: dbUser.name,
              email: dbUser.email,
              role: "Job Seeker"
            }
          });
        }
        return true;
      } catch (error) {
        console.error("OAuth Synthesis Error:", error);
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        // Find DB user again to get their custom Role.
        const dbUser = await prisma.user.findUnique({ where: { email: user.email! } });
        if (dbUser) {
          const customToken = jwt.sign(
            { id: dbUser.id, role: dbUser.role },
            JWT_SECRET,
            { expiresIn: "7d" }
          );
          token.customJwt = customToken;
          token.role = dbUser.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token.customJwt) {
        // Bridge the JWT token string securely so the frontend can retrieve it and mount it to localStorage
        (session as any).customJwt = token.customJwt;
        (session as any).userRole = token.role;
      }
      return session;
    }
  },
  session: { strategy: "jwt" }
});

export { handler as GET, handler as POST };
