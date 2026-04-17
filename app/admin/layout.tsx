import DashboardLayout from "@/components/layouts/DashboardLayout";

// Note: Using 'recruiter' role for admin by default or we can extend DashboardLayout 
// for an 'admin' role if needed. But for now, let's just make it work.
export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout role="recruiter">
      {children}
    </DashboardLayout>
  );
}
