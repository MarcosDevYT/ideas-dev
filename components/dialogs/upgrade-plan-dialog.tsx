"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Check } from "lucide-react";

interface UpgradePlanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const plans = [
  {
    name: "Gratis",
    price: "$0",
    credits: "100 créditos/mes",
    features: [
      "Asistencia IA básica",
      "Hasta 5 proyectos",
      "Soporte comunitario",
    ],
  },
  {
    name: "Pro",
    price: "$19",
    credits: "1000 créditos/mes",
    features: [
      "Asistencia IA avanzada",
      "Proyectos ilimitados",
      "Soporte prioritario",
      "Integraciones personalizadas",
    ],
    popular: true,
  },
  {
    name: "Empresarial",
    price: "Personalizado",
    credits: "Créditos ilimitados",
    features: [
      "Todo lo de Pro",
      "Soporte dedicado",
      "Entrenamiento IA personalizado",
      "Garantía SLA",
    ],
  },
];

export function UpgradePlanDialog({
  open,
  onOpenChange,
}: UpgradePlanDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-4xl 2xl:max-w-6xl">
        <DialogHeader>
          <DialogTitle>Mejora tu Plan</DialogTitle>
          <DialogDescription>
            Elige un plan que se ajuste a tus necesidades y desbloquea más
            funciones.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4 md:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`p-6 relative ${
                plan.popular ? "border-primary shadow-lg" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  Popular
                </div>
              )}
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-2">
                  <span className="text-3xl font-bold">{plan.price}</span>
                  {plan.price !== "Custom" && (
                    <span className="text-muted-foreground">/month</span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  {plan.credits}
                </p>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="size-4 text-primary shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className="w-full mt-auto"
                variant={plan.popular ? "default" : "outline"}
                onClick={() => {
                  // TODO: Implement Stripe integration
                  onOpenChange(false);
                }}
              >
                {plan.name === "Gratis" ? "Plan Actual" : "Mejorar"}
              </Button>
            </Card>
          ))}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
