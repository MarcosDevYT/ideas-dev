"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Coins, Sparkles } from "lucide-react";
import { eventBus, EVENTS } from "@/lib/events";
import { useRouter } from "next/navigation";

export function OutOfCreditsDialog() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleOutOfCredits = () => {
      setOpen(true);
    };

    eventBus.on(EVENTS.OUT_OF_CREDITS, handleOutOfCredits);

    return () => {
      eventBus.off(EVENTS.OUT_OF_CREDITS, handleOutOfCredits);
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30 mb-4">
            <Coins className="h-6 w-6 text-amber-600 dark:text-amber-500" />
          </div>
          <DialogTitle className="text-center text-xl">
            ¡Te has quedado sin créditos!
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            Has agotado tu saldo de créditos actual. Para continuar creando
            ideas, proyectos y utilizando la Inteligencia Artificial, necesitas
            recargar tu cuenta.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-4">
          <div className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm">
            <div className="flex items-start gap-4">
              <Sparkles className="h-6 w-6 text-primary mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">
                  Actualiza tu plan
                </p>
                <p className="text-sm text-muted-foreground">
                  Desbloquea créditos mensuales o compra un paquete único y
                  apoya a la plataforma.
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            className="w-full sm:w-auto"
          >
            Quizás más tarde
          </Button>
          <Button
            type="button"
            className="w-full sm:w-auto"
            onClick={() => {
              setOpen(false);
              router.push("/credits");
            }}
          >
            <Coins className="mr-2 h-4 w-4" />
            Obtener Créditos
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
