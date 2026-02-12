import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ProfileAccountTab() {
  return (
    <div className="space-y-6 py-4">
      <div className="max-w-md mx-auto space-y-6">
        {/* Sección de Seguridad */}
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Seguridad</h3>
            <p className="text-sm text-muted-foreground">
              Administra la seguridad de tu cuenta
            </p>
          </div>

          {/* Cambio de Contraseña */}
          <div className="space-y-4 border rounded-lg p-4">
            <h4 className="font-medium">Cambiar Contraseña</h4>
            <div className="grid gap-2">
              <Label htmlFor="current-password">Contraseña Actual</Label>
              <Input
                id="current-password"
                type="password"
                placeholder="Ingresa tu contraseña actual"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-password">Nueva Contraseña</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="Ingresa tu nueva contraseña"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirmar Contraseña</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="Confirma tu nueva contraseña"
              />
            </div>
            <Button className="w-full" variant="secondary" disabled>
              Cambiar Contraseña (Próximamente)
            </Button>
          </div>

          {/* Verificación en Dos Pasos */}
          <div className="space-y-4 border rounded-lg p-4">
            <div>
              <h4 className="font-medium">Verificación en Dos Pasos</h4>
              <p className="text-sm text-muted-foreground mt-1">
                Agrega una capa adicional de seguridad a tu cuenta
              </p>
            </div>
            <Button className="w-full" variant="outline" disabled>
              Configurar 2FA (Próximamente)
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
