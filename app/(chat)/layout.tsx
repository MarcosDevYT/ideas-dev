import { Sidebar } from "@/components/sidebar/Sidebar";

import { auth } from "@/auth";

export default async function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <Sidebar user={session?.user} />

      <main className="flex-1 flex flex-col overflow-x-hidden">
        <div className="flex-1 overflow-y-auto">{children}</div>
      </main>
    </div>
  );
}
