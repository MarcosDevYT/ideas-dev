import { signIn } from "@/auth";
import { Button } from "../ui/button";

/**
 * Formulario de login con Google que utiliza el hook signIn de NextAuth configurado en auth.ts
 * @returns Componente de login con Google
 */

export const GoogleSignIn = async () => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("google", {
          redirectTo: "/",
        });
      }}
    >
      <Button
        variant="outline"
        size="loginSize"
        className="px-6 gap-2"
        type="submit"
      >
        <img src="google-icon.svg" className="size-6" alt="Google" />
        Iniciar sesión con Google
      </Button>
    </form>
  );
};
