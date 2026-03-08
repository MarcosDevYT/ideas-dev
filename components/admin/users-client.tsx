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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  MoreHorizontal,
  Search,
  Coins,
  Plus,
  Minus,
  Loader2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { updateUserCreditsAction } from "@/actions/admin-users-actions";

type AdminUser = {
  id: string;
  name: string | null;
  email: string | null;
  createdAt: Date;
  planCredits: number;
  extraCredits: number;
  role: string | null;
  subscription: {
    status: string;
    polarProductId?: string | null;
  } | null;
  _count: {
    projects: number;
    ideaChats: number;
  };
};

interface UsersClientProps {
  initialUsers: AdminUser[];
}

export function UsersClient({ initialUsers }: UsersClientProps) {
  const router = useRouter();
  const [users, setUsers] = useState<AdminUser[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");

  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [isCreditModalOpen, setIsCreditModalOpen] = useState(false);
  const [creditAmount, setCreditAmount] = useState<number>(0);
  const [creditMode, setCreditMode] = useState<"add" | "remove">("add");
  const [creditReason, setCreditReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtrado
  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      user.name?.toLowerCase().includes(search) ||
      user.email?.toLowerCase().includes(search)
    );
  });

  const handleOpenCreditModal = (user: AdminUser, mode: "add" | "remove") => {
    setSelectedUser(user);
    setCreditMode(mode);
    setCreditAmount(0);
    setCreditReason("Ajuste manual del administrador");
    setIsCreditModalOpen(true);
  };

  const handleUpdateCredits = async () => {
    if (!selectedUser || creditAmount <= 0) return;

    setIsSubmitting(true);
    let finalAmount = creditAmount;

    // Si está removiendo y el input es mayor a lo que tiene
    if (creditMode === "remove" && creditAmount > selectedUser.extraCredits) {
      finalAmount = selectedUser.extraCredits;
    }

    const result = await updateUserCreditsAction(
      selectedUser.id,
      finalAmount,
      creditMode === "add",
      creditReason,
    );

    if (result.success) {
      toast.success(result.message);
      setIsCreditModalOpen(false);
      // Podríamos actualizar la prop local o simplemente refrescar la página completa para re-fetch
      router.refresh();

      // Update optimism (Opcional, pero para respuesta más rápida)
      setUsers((prev) =>
        prev.map((u) => {
          if (u.id === selectedUser.id) {
            return {
              ...u,
              extraCredits:
                creditMode === "add"
                  ? u.extraCredits + finalAmount
                  : Math.max(0, u.extraCredits - finalAmount),
            };
          }
          return u;
        }),
      );
    } else {
      toast.error(
        result.error || "Ocurrió un error al actualizar los créditos",
      );
    }
    setIsSubmitting(false);
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nombre o correo..."
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
              <TableHead>Usuario</TableHead>
              <TableHead>Estado / Plan</TableHead>
              <TableHead>Créditos Disponibles</TableHead>
              <TableHead>Uso IA</TableHead>
              <TableHead>Fecha de Registro</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No se encontraron usuarios.
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => {
                const totalCredits = user.planCredits + user.extraCredits;
                const totalUsage = user._count.projects + user._count.ideaChats;

                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">
                          {user.name || "Sin nombre"}
                        </span>
                        <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                          {user.email || "No email"}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {user.subscription?.status === "active" ? (
                          <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">
                            Pro
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="text-muted-foreground"
                          >
                            Free
                          </Badge>
                        )}
                        {user.role === "ADMIN" && (
                          <Badge className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/20">
                            Admin
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5 font-medium">
                        <Coins className="h-4 w-4 text-amber-500" />
                        {totalCredits}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {totalUsage} items
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {format(new Date(user.createdAt), "dd MMM, yyyy", {
                          locale: es,
                        })}
                      </span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Abrir menú</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuItem
                            onClick={() => handleOpenCreditModal(user, "add")}
                          >
                            <Plus className="mr-2 h-4 w-4 text-emerald-500" />
                            Otorgar Créditos
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() =>
                              handleOpenCreditModal(user, "remove")
                            }
                            disabled={user.extraCredits <= 0}
                            className="text-destructive focus:text-destructive"
                          >
                            <Minus className="mr-2 h-4 w-4" />
                            Remover Créditos Extra
                          </DropdownMenuItem>
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

      {/* Credit Modal */}
      <Dialog open={isCreditModalOpen} onOpenChange={setIsCreditModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {creditMode === "add"
                ? "Otorgar Créditos"
                : "Remover Créditos Extra"}
            </DialogTitle>
            <DialogDescription>
              Modifica el saldo de créditos extra permanente para{" "}
              <b className="text-foreground">{selectedUser?.email}</b>.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="amount" className="text-right">
                Cantidad
              </Label>
              <Input
                id="amount"
                type="number"
                min="1"
                className="col-span-3"
                value={creditAmount}
                onChange={(e) => setCreditAmount(Number(e.target.value))}
              />
            </div>
            {creditMode === "remove" && selectedUser && (
              <p className="text-xs text-muted-foreground pl-[90px]">
                Máximo a remover: <b>{selectedUser.extraCredits}</b> (Solo
                extra)
              </p>
            )}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reason" className="text-right">
                Motivo
              </Label>
              <Input
                id="reason"
                className="col-span-3"
                value={creditReason}
                onChange={(e) => setCreditReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCreditModalOpen(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleUpdateCredits}
              disabled={isSubmitting || creditAmount <= 0}
              className={
                creditMode === "remove"
                  ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  : ""
              }
            >
              {isSubmitting && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {creditMode === "add" ? "Añadir" : "Remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
