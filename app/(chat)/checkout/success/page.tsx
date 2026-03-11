"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Home, Sparkles } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const checkoutId = searchParams.get("checkout_id");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-8">
        <div className="relative mx-auto h-24 w-24">
          <div className="absolute inset-0 animate-pulse rounded-full bg-green-500/20" />
          <div className="relative flex h-full w-full items-center justify-center rounded-full border border-green-500/20 bg-muted/50">
            <CheckCircle2 className="h-12 w-12 text-green-500" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="font-syne text-4xl font-bold tracking-tight">
            ¡Pago Exitoso!
          </h1>
          <p className="text-lg text-muted-foreground">
            Gracias por tu compra. Tus beneficios aplicarán automáticamente a tu
            cuenta de IdeasDev en los próximos minutos.
          </p>
          {checkoutId && (
            <p className="text-xs text-muted-foreground/60">
              Ref de Transacción: {checkoutId}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild variant="default" size="lg" className="h-12 px-8">
            <Link href="/credits">
              <Sparkles className="mr-2 h-4 w-4" />
              Ver mis créditos
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 px-8">
            <Link href="/chat">
              <Home className="mr-2 h-4 w-4" />
              Volver al chat
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[70vh] items-center justify-center">
          <span className="text-muted-foreground animate-pulse">
            Cargando...
          </span>
        </div>
      }
    >
      <CheckoutSuccessContent />
    </Suspense>
  );
}
