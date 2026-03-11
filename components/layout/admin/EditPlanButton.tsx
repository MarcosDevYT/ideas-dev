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
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil } from "lucide-react";
import { updatePlanAction } from "@/actions/plans/plan-actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Plan } from "@prisma/client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { editPlanSchema } from "@/lib/zodSchemas/planSchema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export function EditPlanButton({ plan }: { plan: Plan }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof editPlanSchema>>({
    resolver: zodResolver(editPlanSchema),
    defaultValues: {
      name: plan.name,
      description: plan.description || "",
      featuresText: plan.features ? plan.features.join("\n") : "",
      isPopular: plan.isPopular || false,
      environment: plan.polarEnvironment as "sandbox" | "production",
    },
  });

  const onSubmit = async (data: z.infer<typeof editPlanSchema>) => {
    setLoading(true);

    const featuresArray = data.featuresText
      ? data.featuresText
          .split("\n")
          .map((f) => f.trim())
          .filter((f) => f.length > 0)
      : [];

    const result = await updatePlanAction({
      id: plan.id,
      polarProductId: plan.polarProductId!,
      name: data.name,
      description: data.description,
      features: featuresArray,
      isPopular: data.isPopular,
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
        <Button variant="outline" size="sm" className="w-full">
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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
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
                      placeholder="Soporte 24/7\nAcceso prioritario"
                      rows={4}
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
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
