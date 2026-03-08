"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Search,
  MoreHorizontal,
  CheckCircle2,
  Clock,
  AlertCircle,
  XCircle,
  Info,
} from "lucide-react";
import { updateBugStatusAction } from "@/actions/admin-bugs-actions";

type BugReport = {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    name: string | null;
    email: string | null;
  } | null;
};

interface BugsClientProps {
  initialBugs: BugReport[];
}

const statusConfig: Record<
  string,
  {
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    color: string;
    badge: string;
  }
> = {
  OPEN: {
    label: "Abierto",
    icon: AlertCircle,
    color: "text-red-500",
    badge: "bg-red-500/10 text-red-500 border-red-500/20",
  },
  IN_PROGRESS: {
    label: "En progreso",
    icon: Clock,
    color: "text-blue-500",
    badge: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  },
  RESOLVED: {
    label: "Resuelto",
    icon: CheckCircle2,
    color: "text-emerald-500",
    badge: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  },
  CLOSED: {
    label: "Cerrado",
    icon: XCircle,
    color: "text-gray-500",
    badge: "bg-gray-500/10 text-gray-500 border-gray-500/20",
  },
};

export function BugsClient({ initialBugs }: BugsClientProps) {
  const router = useRouter();
  const [bugs, setBugs] = useState<BugReport[]>(initialBugs);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedBug, setSelectedBug] = useState<BugReport | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const filteredBugs = bugs.filter((bug) => {
    const search = searchTerm.toLowerCase();
    return (
      bug.title.toLowerCase().includes(search) ||
      bug.user?.email?.toLowerCase().includes(search) ||
      bug.category.toLowerCase().includes(search)
    );
  });

  const handleStatusChange = async (bugId: string, newStatus: string) => {
    const result = await updateBugStatusAction(bugId, newStatus);

    if (result.success && result.bug) {
      toast.success("Estado actualizado exitosamente");
      // Update local state optimizing for speed
      setBugs((prev) =>
        prev.map((b) =>
          b.id === bugId
            ? { ...b, status: newStatus, updatedAt: new Date() }
            : b,
        ),
      );
      router.refresh();
    } else {
      toast.error(result.error || "No se pudo actualizar el estado");
    }
  };

  const openDetails = (bug: BugReport) => {
    setSelectedBug(bug);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por título, email o categoría..."
            className="pl-8 bg-card"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Remitente</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredBugs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No hay reportes de fallos que coincidan.
                </TableCell>
              </TableRow>
            ) : (
              filteredBugs.map((bug) => {
                const config = statusConfig[bug.status] || statusConfig.OPEN;

                return (
                  <TableRow key={bug.id}>
                    <TableCell className="font-medium">
                      <div className="truncate max-w-[250px]">{bug.title}</div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm">
                          {bug.user?.name || "Anónimo"}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {bug.user?.email || "Sin email"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={config.badge}>
                        {config.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="capitalize">
                        {bug.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(bug.createdAt), "dd MMM, yyyy", {
                        locale: es,
                      })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => openDetails(bug)}>
                            <Info className="mr-2 h-4 w-4" />
                            Ver detalles
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground uppercase">
                            Cambiar estado
                          </DropdownMenuLabel>
                          {Object.entries(statusConfig).map(([key, value]) => (
                            <DropdownMenuItem
                              key={key}
                              onClick={() => handleStatusChange(bug.id, key)}
                              disabled={bug.status === key}
                            >
                              <value.icon
                                className={`mr-2 h-4 w-4 ${value.color}`}
                              />
                              {value.label}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Detalles del Fallo</DialogTitle>
            <DialogDescription>
              Reportado por {selectedBug?.user?.email || "usuario anónimo"}
            </DialogDescription>
          </DialogHeader>
          {selectedBug && (
            <div className="space-y-4 py-4">
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">
                  Título
                </h4>
                <p className="font-semibold">{selectedBug.title}</p>
              </div>
              <div>
                <h4 className="font-medium text-sm text-muted-foreground mb-1">
                  Descripción
                </h4>
                <div className="p-3 bg-muted rounded-md text-sm whitespace-pre-wrap">
                  {selectedBug.description}
                </div>
              </div>
              <div className="flex gap-4">
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    Categoría
                  </h4>
                  <Badge variant="secondary" className="capitalize">
                    {selectedBug.category}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-1">
                    Estado
                  </h4>
                  <Badge
                    variant="outline"
                    className={statusConfig[selectedBug.status]?.badge}
                  >
                    {statusConfig[selectedBug.status]?.label}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
