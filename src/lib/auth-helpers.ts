import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireAdmin() {
  const session = await auth();
  if (!session || (session.user as { role?: string } | undefined)?.role !== "admin") {
    redirect("/admin/login");
  }
  return session;
}

export async function requireStaff() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;
  if (!session || (role !== "admin" && role !== "staff")) {
    redirect("/admin/login");
  }
  return session;
}
