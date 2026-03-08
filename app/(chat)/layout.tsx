import { Sidebar } from "@/components/sidebar/Sidebar";

import { auth } from "@/auth";

import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { OutOfCreditsDialog } from "@/components/dialogs/out-of-credits-dialog";

async function SidebarWrapper() {
  const session = await auth();
  return <Sidebar user={session?.user} />;
}

function SidebarSkeleton() {
  return (
    <div className="w-17 md:w-72 h-screen border-r bg-card hidden md:flex flex-col items-center p-4">
      <Loader2 className="animate-spin text-muted-foreground mt-4" />
    </div>
  );
}

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Suspense fallback={<SidebarSkeleton />}>
        <SidebarWrapper />
      </Suspense>

      <main className="flex-1 flex flex-col overflow-x-hidden">
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>

      {/* Global Modals for the App */}
      <OutOfCreditsDialog />
    </div>
  );
}
