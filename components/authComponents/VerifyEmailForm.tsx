"use client";

import { verifyEmailAction } from "@/actions/auth-actions";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useState, useTransition } from "react";
import { LogoComponent } from "../LogoComponent";

interface VerifyEmailFormProps {
  email: string;
  token: string;
  initialCheckError?: string;
}

export function VerifyEmailForm({
  email,
  token,
  initialCheckError,
}: VerifyEmailFormProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>(initialCheckError);
  const [success, setSuccess] = useState<string | undefined>("");

  const handleVerify = () => {
    setError("");
    setSuccess("");

    startTransition(async () => {
      const result = await verifyEmailAction(email, token);
      if (result.error) {
        setError(result.error);
      } else if (result.success === true) {
        setSuccess("Email verificado correctamente");
      } else {
        setError("Error desconocido");
      }
    });
  };

  // Estado: Error Inicial o Error de Verificación
  if (error) {
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
                {error}
              </p>
              <p className="tracking-wider text-sm text-destructive-foreground text-center">
                El correo electrónico proporcionado no es válido o el enlace
                expiró. Por favor, revisa tu email o solicita un nuevo enlace de
                verificación.
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

  // Estado: Éxito
  if (success) {
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
            <div className="flex flex-col items-center justify-center gap-3 bg-green-500/10 border border-green-500 rounded-lg p-6 w-full">
              <CheckCircle className="w-12 h-12 text-green-500 mb-2" />
              <p className="text-green-600 text-lg font-semibold text-center">
                ¡Email verificado correctamente!
              </p>
              <p className="text-sm text-green-600 text-center">
                Tu correo electrónico ha sido verificado. Ya puedes iniciar
                sesión y disfrutar de IdeasDev.
              </p>
            </div>
            <div className="mt-4 text-center">
              <Link href="/" className="underline text-primary font-medium">
                Ir al Inicio
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Estado: Formulario de Verificación (Inicial)
  return (
    <div className="flex h-screen pt-16 items-center justify-center bg-background">
      <Card className="w-full max-w-lg shadow-lg border border-border">
        <CardHeader className="flex flex-col items-center gap-2">
          <span className="text-xs font-semibold text-secondary-foreground bg-secondary rounded-full px-3 py-1">
            Verificar Email
          </span>
          <LogoComponent className="text-4xl mb-2" />
        </CardHeader>
        <CardContent className="space-y-6 flex flex-col items-center justify-center text-center">
          <p>Por favor confirma tu correo electrónico: {email}</p>
          <div className="w-full flex justify-center">
            <button
              onClick={handleVerify}
              disabled={isPending}
              className="rounded-xl bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90 transition-all h-9 text-sm px-4 flex items-center justify-center min-w-[140px]"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                "Verificar Ahora"
              )}
            </button>
          </div>
          <div className="mt-4 text-center">
            <Link href="/" className="underline text-primary font-medium">
              Volver al Inicio
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
