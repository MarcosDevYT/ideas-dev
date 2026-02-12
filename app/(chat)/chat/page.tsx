import { ChatLayout } from "@/components/layout/chat-layout";
import { auth } from "@/auth";
import { UserWithDetails } from "@/types/user-types";

export default async function ChatPage() {
  const session = await auth();
  const user = session?.user;

  return <ChatLayout user={user as UserWithDetails} />;
}
