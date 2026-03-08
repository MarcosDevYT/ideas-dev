"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { XCircle, ArrowLeft } from "lucide-react";

export default function CheckoutErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-6 text-center">
      <div className="max-w-md space-y-8">
        <div className="relative mx-auto h-24 w-24">
          <div className="absolute inset-0 animate-pulse rounded-full bg-destructive/20" />
          <div className="relative flex h-full w-full items-center justify-center rounded-full border border-destructive/20 bg-muted/50">
            <XCircle className="h-12 w-12 text-destructive" />
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="font-syne text-4xl font-bold tracking-tight">
            Pago Incompleto
          </h1>
          <p className="text-lg text-muted-foreground">
            No pudimos procesar tu pago o la compra ha sido cancelada o
            denegada. No te hemos realizado ningún cargo.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild variant="default" size="lg" className="h-12 px-8">
            <Link href="/credits">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a intentarlo
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
