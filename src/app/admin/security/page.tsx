import { AdminSecurityPanel } from "@/components/admin/security-panel";

export const metadata = { title: "Security — Admin" };

export default function AdminSecurityPage() {
  return (
    <div>
      <h1 className="font-display text-2xl text-bone mb-8">Security</h1>
      <AdminSecurityPanel />
    </div>
  );
}
