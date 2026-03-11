"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { clonePlanAction } from "@/actions/plans/clone-plan-action";
import { Plan } from "@prisma/client";

export function ClonePlanButton({ plan }: { plan: Plan }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const isSandbox = plan.polarEnvironment === "sandbox";
  const targetEnvName = isSandbox ? "Producción" : "Sandbox";

  const handleClone = async () => {
    setLoading(true);
    toast.loading(`Clonando a ${targetEnvName}...`, { id: "cloning" });

    const res = await clonePlanAction(plan.id);

    if (res.success) {
      toast.success(`Plan clonado exitosamente a ${targetEnvName}`, {
        id: "cloning",
      });
      router.refresh();
    } else {
      toast.error(res.error || "Hubo un error al clonar", { id: "cloning" });
    }
    setLoading(false);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full flex items-center justify-center gap-2"
      onClick={handleClone}
      disabled={loading}
    >
      <Copy className="h-4 w-4" />
      {loading ? "Clonando..." : `Clonar a ${targetEnvName}`}
    </Button>
  );
}
