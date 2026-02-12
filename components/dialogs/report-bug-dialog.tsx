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
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { submitBugReportAction } from "@/actions/bug-report-actions";
import { toast } from "sonner";
import { BugReportInput } from "@/lib/zodSchemas/bugReportSchema";

interface ReportBugDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ReportBugDialog({ open, onOpenChange }: ReportBugDialogProps) {
  const [formData, setFormData] = useState<BugReportInput>({
    title: "",
    description: "",
    category: "Other",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setIsLoading(true);

    const result = await submitBugReportAction(formData);

    setIsLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Reporte de error enviado exitosamente");
      setFormData({ title: "", description: "", category: "Other" });
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Reportar un Error</DialogTitle>
          <DialogDescription>
            Ayúdanos a mejorar reportando cualquier problema que encuentres.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="bug-title">Título</Label>
            <Input
              id="bug-title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="Descripción breve del problema"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bug-category">Categoría</Label>
            <Select
              value={formData.category}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  category: value as BugReportInput["category"],
                })
              }
            >
              <SelectTrigger id="bug-category">
                <SelectValue placeholder="Selecciona una categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UI">Interfaz</SelectItem>
                <SelectItem value="API">API</SelectItem>
                <SelectItem value="Performance">Rendimiento</SelectItem>
                <SelectItem value="Other">Otro</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="bug-description">Descripción</Label>
            <Textarea
              id="bug-description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Descripción detallada del error..."
              rows={5}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? "Enviando..." : "Enviar Reporte"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
