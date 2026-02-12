import { auth } from "@/auth";
import { Navbar } from "@/components/layout/navbar";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user || null;

  return (
    <>
      <Navbar user={user} />

      <main>{children}</main>
    </>
  );
}
