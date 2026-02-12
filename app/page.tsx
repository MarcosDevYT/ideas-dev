import { auth } from "@/auth";
import { UserWithDetails } from "@/types/user-types";
import { Home } from "@/components/layout/home";

export const dynamic = "force-dynamic";
export const revalidate = 3600; // 1 hour

export default async function HomePage() {
  const session = await auth();
  const user = session?.user;

  return <Home user={user as unknown as UserWithDetails} />;
}
