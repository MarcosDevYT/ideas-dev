import { GoogleSignIn } from "@/components/authComponents/GoogleSignIn";
import { LogOutButton } from "@/components/authComponents/LogOutButton";
import { auth } from "@/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GithubSignIn } from "@/components/authComponents/GitHubSignIn";
import EmailVerificationStatus from "@/components/authComponents/EnviarVerificacionButton";

export default async function Home() {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-semibold">Authentication</h1>

      {session ? (
        <div className="flex flex-col items-center gap-4 p-6 bg-accent rounded-lg shadow-md">
          {session.user?.image && (
            <img
              src={session.user.image}
              alt="User Avatar"
              className="w-16 h-16 rounded-full"
            />
          )}
          <div className="text-center">
            <p className="text-lg font-medium">{session.user?.name}</p>
            <p className="text-sm text-muted-foreground">
              {session.user?.email}
            </p>
          </div>
          <EmailVerificationStatus session={session} />
          <LogOutButton />
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <Link href="/login">
            <Button size="lg" className="w-full">
              Iniciar Sesión con Email
            </Button>
          </Link>
          <GoogleSignIn />
          <GithubSignIn />
        </div>
      )}
    </div>
  );
}
