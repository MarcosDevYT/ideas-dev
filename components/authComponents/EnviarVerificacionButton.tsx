"use client";

import { sendVerifyEmailAction } from "@/actions/auth-actions";
import { Check } from "lucide-react";
import { Session } from "next-auth";
import { useTransition } from "react";
import { toast } from "sonner";
import { Button } from "../ui/button";

export default function EmailVerificationStatus({
  session,
}: {
  session: Session;
}) {
  const [isPending, startTransition] = useTransition();

  const isVerified = session.user.emailVerified || false;

  const handleSendVerification = async () => {
    startTransition(async () => {
      const res = await sendVerifyEmailAction(session.user.email!);
      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Correo de verificación enviado", {
          description: res?.success
            ? res.success
            : "Por favor, verifica tu email para continuar",
        });
      }
    });
  };

  if (isVerified === null) return;

  return isVerified ? (
    <span className="text-secondary-foreground bg-secondary font-semibold text-sm p-0.5 px-2 md:px-3 rounded-full inline-flex items-center gap-2">
      Verificado <Check className="size-4" strokeWidth={2.5} />
    </span>
  ) : (
    <Button
      onClick={handleSendVerification}
      disabled={isPending}
      className="rounded-xl bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90 transition-all h-9 text-sm px-4"
    >
      {isPending ? "Enviando..." : "Verificar correo"}
    </Button>
  );
}
