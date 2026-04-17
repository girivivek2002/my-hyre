import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function RecruiterRoot({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout role="recruiter">
      {children}
    </DashboardLayout>
  );
}
