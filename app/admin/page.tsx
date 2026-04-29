import AdminDashboard from "@/components/admin/AdminDashboard";

export const metadata = {
  title: "Admin Panel"
};

export default function AdminPage() {
  return (
    <main className="min-h-screen bg-dough py-6">
      <AdminDashboard />
    </main>
  );
}
