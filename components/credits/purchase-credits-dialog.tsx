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
import { getPublicPlansAction } from "@/actions/plans/plan-actions";
import { createCheckoutSessionAction } from "@/actions/polar/checkout-actions";
import { Loader2, Check } from "lucide-react";
import { toast } from "sonner";
import { useEffect } from "react";
import { Plan } from "@prisma/client";

interface PurchaseCreditsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PurchaseCreditsDialog({
  open,
  onOpenChange,
}: PurchaseCreditsDialogProps) {
  const [loading, setLoading] = useState(false);
  const [packages, setPackages] = useState<Plan[]>([]);
  const [isLoadingPackages, setIsLoadingPackages] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);

  useEffect(() => {
    if (open && packages.length === 0) {
      setIsLoadingPackages(true);
      getPublicPlansAction().then((res) => {
        if (res.success && res.creditPackages) {
          setPackages(res.creditPackages);
        }
        setIsLoadingPackages(false);
      });
    }
  }, [open, packages.length]);

  const handlePurchase = async (pkg: Plan) => {
    if (!pkg.polarProductId) {
      toast.error("Este paquete no tiene un producto asociado.");
      return;
    }

    setLoading(true);
    setSelectedPackage(pkg.id);

    try {
      const res = await createCheckoutSessionAction(pkg.polarProductId);

      if (res.success && res.url) {
        window.location.assign(res.url);
      } else {
        toast.error(res.error || "Error al generar la sesión de compra.");
      }
    } catch (error) {
      console.error("Error al redirigir al checkout:", error);
      toast.error("Error al procesar la solicitud");
    } finally {
      setLoading(false);
      setSelectedPackage(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] w-full md:max-w-3xl lg:max-w-4xl xl:max-w-5xl">
        <DialogHeader>
          <DialogTitle>Comprar Créditos</DialogTitle>
          <DialogDescription>
            Elige el paquete que mejor se adapte a tus necesidades
          </DialogDescription>
        </DialogHeader>

        {isLoadingPackages ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 py-4 px-2 max-h-[calc(100vh-200px)] overflow-y-auto">
            {packages.map((pkg) => (
              <Card
                key={pkg.id}
                className={`relative p-6 hover:shadow-lg transition-shadow border-2 ${
                  pkg.isPopular ? "border-primary" : "border-border"
                }`}
              >
                {pkg.isPopular && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
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
                    onClick={() => handlePurchase(pkg)}
                    disabled={loading}
                    className="w-full"
                    variant={pkg.isPopular ? "default" : "outline"}
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
        )}
      </DialogContent>
    </Dialog>
  );
}
