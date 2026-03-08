import { FormRegister } from "@/components/authComponents/FormRegister";
import { GithubSignIn } from "@/components/authComponents/GitHubSignIn";
import { GoogleSignIn } from "@/components/authComponents/GoogleSignIn";
import { LogoComponent } from "@/components/LogoComponent";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrarse",
  description:
    "Creá tu cuenta gratuita en IdeasDev y empiezá a generar proyectos tecnológicos con IA hoy mismo.",
};

export const dynamic = "force-static";

export default function RegisterPage() {
  return (
    <div className="flex h-screen pt-16 items-center justify-center bg-background">
      <Card className="w-full max-w-lg shadow-lg border border-border">
        <CardHeader className="flex flex-col items-center gap-2">
          <span className="text-xs font-semibold text-secondary-foreground bg-secondary rounded-full px-3 py-1">
            Registrarse
          </span>
          <LogoComponent className="text-4xl mb-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <FormRegister />
          <div className="flex flex-col gap-3 md:flex-row">
            <GoogleSignIn />
            <GithubSignIn />
          </div>
          <div className="mt-4 text-center">
            <a href="/login" className="underline text-primary font-medium">
              ¿Ya tienes cuenta? Iniciar sesión
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
