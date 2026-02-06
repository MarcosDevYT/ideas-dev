import { signOut } from "@/auth";
import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
/**
 * Botón de logout que utiliza el hook signOut de NextAuth configurado en auth.ts
 * @returns Componente de logout
 */

export async function LogOutButton() {
  return (
    <form
      action={async () => {
        "use server";
        await signOut();
      }}
    >
      <Button type="submit">
        <LogOut className="size-4" />
        Cerrar sesión
      </Button>
    </form>
  );
}
