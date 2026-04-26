"use client";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { usePathname } from "next/navigation";

export default function RecruiterRoot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't wrap auth pages (signup/login) in DashboardLayout
  if (pathname.includes("/signup") || pathname.includes("/login")) {
    return <>{children}</>;
  }

  return (
    <DashboardLayout role="recruiter">
      {children}
    </DashboardLayout>
  );
}
