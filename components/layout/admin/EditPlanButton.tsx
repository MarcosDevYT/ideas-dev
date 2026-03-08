"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil } from "lucide-react";
import { updatePlanAction } from "@/actions/plans/plan-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plan } from "@prisma/client";

export function EditPlanButton({ plan }: { plan: Plan }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const [name, setName] = useState(plan.name);
  const [description, setDescription] = useState(plan.description || "");
  const [featuresInput, setFeaturesInput] = useState(
    plan.features?.join("\n") || "",
  );
  const [isPopular, setIsPopular] = useState(plan.isPopular || false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const featuresArray = featuresInput
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    const result = await updatePlanAction({
      id: plan.id,
      polarProductId: plan.polarProductId!,
      name,
      description,
      features: featuresArray,
      isPopular,
    });

    if (result?.success) {
      toast.success("Plan actualizado exitosamente");
      setOpen(false);
      router.refresh(); // Refrescar la página para ver los cambios
    } else {
      toast.error(result?.error || "Error al actualizar el plan");
    }

    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="mt-4 w-full">
          <Pencil className="w-4 h-4 mr-2" /> Editar Plan
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Editar {plan.name}</DialogTitle>
          <DialogDescription>
            Modifica los detalles del plan. Los cambios se reflejarán tanto en
            nuestra base de datos como en la metadata de Polar.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="features">Características (una por línea)</Label>
            <Textarea
              id="features"
              placeholder="Soporte 24/7\nAcceso prioritario"
              value={featuresInput}
              onChange={(e) => setFeaturesInput(e.target.value)}
              rows={4}
            />
          </div>

          <div className="flex items-center space-x-2 border p-3 rounded-md">
            <Checkbox
              id="isPopular"
              checked={isPopular}
              onCheckedChange={(checked: boolean | "indeterminate") =>
                setIsPopular(checked === true)
              }
            />
            <Label
              htmlFor="isPopular"
              className="text-sm font-medium leading-none"
            >
              Marcar como Popular
            </Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Cambios"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
