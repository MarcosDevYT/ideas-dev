import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { AdminLayout } from "@/components/layout/admin/admin-layout";
import { UserWithDetails } from "@/types/user-types";

export default async function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  const adminEmail = process.env.ADMIN_EMAIL;

  if (!session?.user?.email || session.user.email !== adminEmail) {
    redirect("/");
  }

  return (
    <AdminLayout user={session.user as UserWithDetails}>{children}</AdminLayout>
  );
}
