import { verifyResetPasswordTokenAction } from "@/actions/auth-actions";
import { FormResetPassword } from "@/components/authComponents/FormResetPassword";
import { LogoComponent } from "@/components/LogoComponent";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { XCircle } from "lucide-react";
import Link from "next/link";

export default async function ResetPasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ token: string }>;
}) {
  const { token } = await searchParams;

  const verificationResult = await verifyResetPasswordTokenAction(token);

  if (!token || !verificationResult.success) {
    return (
      <div className="flex h-screen pt-16 items-center justify-center bg-background">
        <Card className="w-full max-w-lg shadow-lg border border-border">
          <CardHeader className="flex flex-col items-center gap-2">
            <span className="text-xs font-semibold text-secondary-foreground bg-secondary rounded-full px-3 py-1">
              Verificar Email
            </span>
            <LogoComponent className="text-4xl mb-2" />
          </CardHeader>
          <CardContent className="space-y-6 flex flex-col items-center justify-center">
            <div className="flex flex-col items-center justify-center gap-3 bg-destructive/10 border border-destructive rounded-lg p-6 w-full">
              <XCircle className="w-12 h-12 text-destructive" />
              <p className="text-destructive text-lg font-semibold text-center">
                Token inválido o faltante
              </p>
              <p className="tracking-wider text-sm text-destructive-foreground text-center">
                El token proporcionado no es válido o ha expirado. Por favor,
                solicita un nuevo enlace de restablecimiento de contraseña.
              </p>
            </div>
            <div className="mt-4 text-center">
              <Link href="/" className="underline text-primary font-medium">
                Volver al inicio
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex h-screen pt-16 items-center justify-center bg-background">
      <Card className="w-full max-w-lg shadow-lg border border-border">
        <CardHeader className="flex flex-col items-center gap-2">
          <span className="text-xs font-semibold text-secondary-foreground bg-secondary rounded-full px-3 py-1">
            Restablecer Contraseña
          </span>
          <LogoComponent className="text-4xl mb-2" />
        </CardHeader>
        <CardContent className="space-y-6">
          <FormResetPassword token={token} />
          <div className="mt-4 text-center">
            <a href="/login" className="underline text-primary font-medium">
              Volver a iniciar sesión
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
