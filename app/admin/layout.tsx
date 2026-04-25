export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root min-h-screen bg-black">
      {children}
    </div>
  );
}
