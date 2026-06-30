import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (session?.user) {
    return (
      <div className="flex min-h-screen bg-vitrine">
        <AdminSidebar userName={session.user.name || session.user.email || "Admin"} />
        <main className="flex-1 overflow-y-auto p-8">{children}</main>
      </div>
    );
  }

  return <>{children}</>;
}
