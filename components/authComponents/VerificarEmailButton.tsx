"use client";

import { useState, useTransition } from "react";
import { Button } from "../ui/button";
import { CheckCircle, Home } from "lucide-react";
import { useRouter } from "next/navigation";

export const VerificarEmailButton = ({ token }: { token: string }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerifyEmail = () => {
    startTransition(async () => {
      const response = await fetch(`/api/auth/verify-email?token=${token}`);
      if (response.ok) {
        setSuccess(true);
      } else {
        setError("Error al verificar el email");
      }
    });
  };

  return (
    <>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      {success ? (
        <div className="flex flex-col items-center justify-center gap-4">
          <div className="flex items-center justify-center bg-green-50 rounded-full p-2">
            <CheckCircle className="size-12 text-green-500" />
          </div>

          <p className="text-green-500 text-center text-lg">
            Email verificado correctamente
          </p>

          <Button size="loginSize" onClick={() => router.push("/")}>
            <Home className="size-6" /> Volver al inicio
          </Button>
        </div>
      ) : (
        <Button size="loginSize" onClick={handleVerifyEmail}>
          {isPending ? "Verificando..." : "Verificar email"}
        </Button>
      )}
    </>
  );
};
