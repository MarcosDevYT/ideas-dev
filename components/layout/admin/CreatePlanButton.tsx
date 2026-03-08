"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  createSubscriptionPlanAction,
  createCreditPackageAction,
} from "@/actions/plans/plan-actions";

export function CreatePlanButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [type, setType] = useState<"subscription" | "credits">("subscription");

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [credits, setCredits] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [featuresInput, setFeaturesInput] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const priceAmount = Math.round(parseFloat(price) * 100);

    const features = featuresInput
      .split("\n")
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    let res;
    if (type === "subscription") {
      res = await createSubscriptionPlanAction({
        name,
        description,
        priceAmount,
        planCredits: parseInt(credits),
        isPopular,
        features,
      });
    } else {
      res = await createCreditPackageAction({
        name,
        description,
        priceAmount,
        extraCredits: parseInt(credits),
        isPopular,
        features,
      });
    }

    setLoading(false);
    console.log("[CreatePlanButton] Resultado de la acción:", res);

    if (res.success) {
      toast.success("Producto creado en Polar.");
      setOpen(false);

      // Reset form
      setName("");
      setDescription("");
      setPrice("");
      setCredits("");
      setIsPopular(false);
      setFeaturesInput("");

      router.refresh();
    } else {
      toast.error(res.error || "Hubo un error al crear el producto.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4" />
          Nuevo Producto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Producto en Polar</DialogTitle>
          <DialogDescription>
            Agrega un plan de suscripción o paquete de créditos a tu plataforma.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Tipo de Producto</Label>
            <Select
              value={type}
              onValueChange={(val: "subscription" | "credits") => setType(val)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="subscription">
                  Plan de Suscripción
                </SelectItem>
                <SelectItem value="credits">
                  Paquete de Créditos Extra
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              placeholder="Ej: Plan Pro"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              placeholder="Detalles del plan..."
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="features">Características (una por línea)</Label>
            <Textarea
              id="features"
              placeholder="Chat con I.A.&#10;Modelos Premium&#10;Soporte 24/7"
              value={featuresInput}
              onChange={(e) => setFeaturesInput(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <div className="flex items-center space-x-2 pb-2">
            <input
              type="checkbox"
              id="isPopular"
              checked={isPopular}
              onChange={(e) => setIsPopular(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="isPopular" className="cursor-pointer">
              Marcar como Popular
            </Label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">Precio (USD)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0.5"
                placeholder="10.00"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="credits">
                {type === "subscription" ? "Créditos/Mes" : "Total Créditos"}
              </Label>
              <Input
                id="credits"
                type="number"
                min="1"
                placeholder="1000"
                required
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
              />
            </div>
          </div>

          <div className="flex justify-end pt-4 space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creando..." : "Crear Producto"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
