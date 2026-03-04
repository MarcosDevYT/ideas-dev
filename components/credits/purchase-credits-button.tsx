"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PurchaseCreditsDialog } from "./purchase-credits-dialog";
import { useRouter } from "next/navigation";
import { eventBus, EVENTS } from "@/lib/events";

export function PurchaseCreditsButton() {
  const [showPurchaseDialog, setShowPurchaseDialog] = useState(false);
  const router = useRouter();

  const handlePurchaseSuccess = () => {
    setShowPurchaseDialog(false);
    // Revalidar la página para obtener datos actualizados
    router.refresh();
    // Actualizar sidebar
    eventBus.emit(EVENTS.REFRESH_SIDEBAR);
  };

  return (
    <>
      <Button
        onClick={() => setShowPurchaseDialog(true)}
        className="w-full"
        size="lg"
      >
        <Plus className="h-4 w-4 mr-2" />
        Comprar Créditos
      </Button>

      <PurchaseCreditsDialog
        open={showPurchaseDialog}
        onOpenChange={setShowPurchaseDialog}
        onSuccess={handlePurchaseSuccess}
      />
    </>
  );
}
