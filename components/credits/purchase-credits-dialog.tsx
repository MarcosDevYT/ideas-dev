"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CREDIT_PACKAGES, type PackageId } from "@/actions/credits/constants";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";

interface PurchaseCreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function PurchaseCreditsDialog({
  open,
  onOpenChange,
  onSuccess,
}: PurchaseCreditsDialogProps) {
  const [loading, setLoading] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<PackageId | null>(
    null,
  );

  const handlePurchase = async (packageId: PackageId) => {
    setLoading(true);
    setSelectedPackage(packageId);

    try {
      const res = await fetch("/api/credits/purchase", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ packageId }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Error al procesar la compra");
      }

      const data = await res.json();

      // Mostrar mensaje de éxito
      toast.success(
        `¡Compra exitosa! Se agregaron ${data.credits} créditos a tu cuenta.`,
      );

      // Cerrar el diálogo y notificar al padre
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Error:", error);
      toast.error(
        error instanceof Error ? error.message : "Error al procesar la compra",
      );
    } finally {
      setLoading(false);
      setSelectedPackage(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Comprar Créditos</DialogTitle>
          <DialogDescription>
            Elige el paquete que mejor se adapte a tus necesidades
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4">
          {Object.values(CREDIT_PACKAGES).map((pkg) => (
            <Card
              key={pkg.id}
              className={`relative p-6 hover:shadow-lg transition-shadow ${
                pkg.popular ? "border-primary border-2" : ""
              }`}
            >
              {pkg.popular && (
                <Badge className="absolute -top-2 left-1/2 -translate-x-1/2">
                  🏆 Mejor Valor
                </Badge>
              )}

              <div className="text-center space-y-4">
                <div>
                  <h3 className="font-bold text-lg">{pkg.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {pkg.description}
                  </p>
                </div>

                <div className="py-4">
                  <p className="text-4xl font-bold">{pkg.credits}</p>
                  <p className="text-sm text-muted-foreground">créditos</p>
                </div>

                <div className="text-2xl font-bold text-primary">
                  ${pkg.price}
                </div>

                <Button
                  onClick={() => handlePurchase(pkg.id)}
                  disabled={loading}
                  className="w-full"
                  variant={pkg.popular ? "default" : "outline"}
                >
                  {loading && selectedPackage === pkg.id ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Comprar
                    </>
                  )}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
