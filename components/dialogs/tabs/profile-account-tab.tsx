"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { changePasswordAction } from "@/actions/auth-actions";
import { createCustomerPortalSessionAction } from "@/actions/polar/portal-actions";
import { Loader2 } from "lucide-react";

import { UserWithDetails } from "@/types/user-types";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ProfileAccountTab({ user }: { user?: UserWithDetails | null }) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isLoadingPortal, setIsLoadingPortal] = useState(false);

  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Por favor completa todos los campos.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Las nuevas contraseñas no coinciden.");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("La nueva contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setIsChangingPassword(true);
    const result = await changePasswordAction(currentPassword, newPassword);
    setIsChangingPassword(false);

    if (result.success) {
      toast.success("Contraseña actualizada exitosamente.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } else {
      toast.error(result.error || "Ocurrió un error.");
    }
  };

  const handlePortalRedirect = async () => {
    setIsLoadingPortal(true);
    const result = await createCustomerPortalSessionAction();

    if (result.success && result.url) {
      window.open(result.url, "_blank"); // Abrir en nueva pestaña
      setIsLoadingPortal(false);
    } else {
      toast.error(result.error || "No se pudo acceder al portal de cliente.");
      setIsLoadingPortal(false);
    }
  };

  return (
    <div className="space-y-6 py-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Sección de Seguridad */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Seguridad y Facturación</h3>
            <p className="text-sm text-muted-foreground">
              Administra la seguridad de tu cuenta y métodos de pago
            </p>
          </div>

          {/* Cambio de Contraseña */}
          <div className="space-y-4 border rounded-lg p-4">
            <h4 className="font-medium">Cambiar Contraseña</h4>

            {user?.hasPassword === false ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Cuenta vinculada externamente</AlertTitle>
                <AlertDescription>
                  Iniciaste sesión utilizando un proveedor de terceros (como
                  Google o Github). Tu cuenta no utiliza una contraseña local,
                  por lo que no es necesario cambiarla.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="current-password">Contraseña Actual</Label>
                  <Input
                    id="current-password"
                    type="password"
                    placeholder="Ingresa tu contraseña actual"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    disabled={isChangingPassword}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="new-password">Nueva Contraseña</Label>
                  <Input
                    id="new-password"
                    type="password"
                    placeholder="Ingresa tu nueva contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isChangingPassword}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    placeholder="Confirma tu nueva contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isChangingPassword}
                  />
                </div>
                <Button
                  className="w-full"
                  variant="secondary"
                  onClick={handlePasswordChange}
                  disabled={isChangingPassword}
                >
                  {isChangingPassword ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {isChangingPassword ? "Cambiando..." : "Cambiar Contraseña"}
                </Button>
              </>
            )}
          </div>

          {/* Portal de Cliente (Suscripción y Pagos) */}
          <div className="space-y-4 border rounded-lg p-4">
            <div>
              <h4 className="font-medium">
                Gestionar Suscripción y Facturación
              </h4>
              <p className="text-sm text-muted-foreground mt-1">
                Accede a tu portal seguro en Polar para actualizar métodos de
                pago, ver facturas y administrar tu plan recurrente.
              </p>
            </div>
            <Button
              className="w-full"
              variant="outline"
              onClick={handlePortalRedirect}
              disabled={isLoadingPortal}
            >
              {isLoadingPortal ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}
              {isLoadingPortal
                ? "Redirigiendo a Polar..."
                : "Abrir Portal de Cliente"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
