import DashboardLayout from "@/components/layouts/DashboardLayout";

export default function CandidateRoot({ children }: { children: React.ReactNode }) {
  return (
    <DashboardLayout role="candidate">
      {children}
    </DashboardLayout>
  );
}
