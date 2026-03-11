"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { archivePlanAction } from "@/actions/plans/plan-actions";
import { Plan } from "@prisma/client";

export function DeletePlanButton({ plan }: { plan: Plan }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm(`¿Estás seguro de que deseas eliminar el plan "${plan.name}"? Esto lo archivará en Polar y lo ocultará de esta lista.`)) return;

    setLoading(true);
    toast.loading("Archivando plan...", { id: "archiving" });
    
    const res = await archivePlanAction(plan.id);
    
    if (res.success) {
      toast.success("Plan archivado exitosamente.", { id: "archiving" });
      router.refresh();
    } else {
      toast.error(res.error || "Hubo un error al archivar", { id: "archiving" });
    }
    setLoading(false);
  };

  return (
    <Button
      variant="destructive"
      size="sm"
      className="w-full flex items-center justify-center gap-2 mt-2"
      onClick={handleDelete}
      disabled={loading}
    >
      <Trash2 className="h-4 w-4" />
      {loading ? "Archivando..." : "Eliminar"}
    </Button>
  );
}
