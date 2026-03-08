import { auth } from "@/auth";
import { Navbar } from "@/components/layout/navbar";
import { UserWithDetails } from "@/types/user-types";
import { Footer } from "@/components/layout/footer";
import { Container } from "@/components/layout/container";

export default async function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Navbar user={user as UserWithDetails} />
      <main className="flex-1 ">
        <Container>{children}</Container>
      </main>
      <Footer />
    </div>
  );
}
