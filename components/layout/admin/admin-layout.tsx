import { AdminSidebar } from "./admin-sidebar";
import { AdminHeader } from "./admin-header";
import { UserWithDetails } from "@/types/user-types";

interface AdminLayoutProps {
  children: React.ReactNode;
  user: UserWithDetails;
  title?: string;
}

export function AdminLayout({ children, user, title }: AdminLayoutProps) {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <AdminSidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader user={user} title={title} />

        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
