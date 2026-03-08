import { FormLogin } from "@/components/authComponents/FormLogin";
import { GithubSignIn } from "@/components/authComponents/GitHubSignIn";
import { GoogleSignIn } from "@/components/authComponents/GoogleSignIn";
import { LogoComponent } from "@/components/LogoComponent";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Iniciar Sesión",
  description:
    "Accedé a tu cuenta de IdeasDev para continuar construyendo tus ideas con IA.",
};

export const dynamic = "force-dynamic";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ verified: string }>;
}) {
  const isVerified = (await searchParams).verified === "true";

  return (
    <div className="flex h-screen pt-16 items-center justify-center bg-background">
      <Card className="w-full max-w-lg shadow-lg border border-border">
        <CardHeader className="flex flex-col items-center gap-2">
          <span className="text-xs font-semibold text-secondary-foreground bg-secondary rounded-full px-3 py-1">
            Iniciar Sesión
          </span>
          <LogoComponent className="text-4xl mb-2" />
        </CardHeader>

        <CardContent className="space-y-6">
          <FormLogin isVerified={isVerified} />

          <div className="flex flex-col gap-3 md:flex-row">
            <GoogleSignIn />
            <GithubSignIn />
          </div>

          <div className="mt-4 text-center">
            <a href="/register" className="underline text-primary font-medium">
              ¿No tienes cuenta? Registrate
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
