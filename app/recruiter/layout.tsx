"use client";
import React, { Suspense } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { usePathname } from "next/navigation";
import { Loader2 } from "lucide-react";

export default function RecruiterRoot({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't wrap auth pages (signup/login) in DashboardLayout
  if (pathname.includes("/signup") || pathname.includes("/login")) {
    return <>{children}</>;
  }

  return (
    <Suspense fallback={
      <div className="flex h-screen bg-[#FAFBFD] dark:bg-[#0A0A0F] items-center justify-center">
        <Loader2 className="animate-spin text-indigo-500" size={40} />
      </div>
    }>
      <DashboardLayout role="recruiter">
        {children}
      </DashboardLayout>
    </Suspense>
  );
}
