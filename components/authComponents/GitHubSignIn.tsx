import { signIn } from "@/auth";
import { Button } from "../ui/button";
import { Github } from "lucide-react";

/**
 * Formulario de login con GitHub que utiliza el hook signIn de NextAuth configurado en auth.ts
 * @returns Componente de login con GitHub
 */

export const GithubSignIn = async () => {
  return (
    <form
      action={async () => {
        "use server";
        await signIn("github", {
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
        <Github className="size-6 text-violet-500" />
        Iniciar sesión con GitHub
      </Button>
    </form>
  );
};
