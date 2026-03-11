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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";
import {
  createSubscriptionPlanAction,
  createCreditPackageAction,
} from "@/actions/plans/plan-actions";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createPlanSchema } from "@/lib/zodSchemas/planSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function CreatePlanButton() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof createPlanSchema>>({
    resolver: zodResolver(createPlanSchema),
    defaultValues: {
      type: "subscription" as "subscription" | "credits",
      name: "",
      description: "",
      featuresText: "",
      isPopular: false,
      environment: "sandbox" as "sandbox" | "production",
      price: "",
      credits: "",
    },
  });

  const watchType = form.watch("type");

  const onSubmit = async (data: z.infer<typeof createPlanSchema>) => {
    setLoading(true);

    const priceAmount = Math.round(parseFloat(data.price) * 100);

    const features = data.featuresText
      ? data.featuresText
          .split("\n")
          .map((f) => f.trim())
          .filter((f) => f.length > 0)
      : [];

    let res;
    if (data.type === "subscription") {
      res = await createSubscriptionPlanAction({
        name: data.name,
        description: data.description,
        priceAmount,
        planCredits: parseInt(data.credits, 10),
        isPopular: data.isPopular,
        features,
        environment: data.environment,
      });
    } else {
      res = await createCreditPackageAction({
        name: data.name,
        description: data.description,
        priceAmount,
        extraCredits: parseInt(data.credits, 10),
        isPopular: data.isPopular,
        features,
        environment: data.environment,
      });
    }

    setLoading(false);

    if (res.success) {
      toast.success("Producto creado con éxito.");
      setOpen(false);

      form.reset();
      router.refresh();
    } else {
      toast.error(res.error || "Hubo un error al crear el producto.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4 max-h-[70vh] overflow-y-auto px-2">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Producto</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="subscription">
                        Plan de Suscripción
                      </SelectItem>
                      <SelectItem value="credits">
                        Paquete de Créditos Extra
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Plan Pro" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="environment"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Entorno a Crear (Sandbox o Production)</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona el entorno" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="sandbox">Sandbox (Pruebas)</SelectItem>
                      <SelectItem value="production">Production (Real)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Detalles del plan..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="featuresText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Características (una por línea)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Chat con I.A.&#10;Modelos Premium&#10;Soporte 24/7"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isPopular"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0 rounded-md border p-3">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel>Marcar como Popular</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Precio (USD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        placeholder="10.00"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="credits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {watchType === "subscription" ? "Créditos/Mes" : "Total Créditos"}
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="1"
                        placeholder="1000"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
        </Form>
      </DialogContent>
    </Dialog>
  );
}
