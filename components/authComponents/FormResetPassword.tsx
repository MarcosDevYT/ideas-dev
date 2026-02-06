"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/lib/zodSchemas/authSchema";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useState, useTransition } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, Loader2 } from "lucide-react";
import { resetPasswordAction } from "@/actions/auth-actions";

export const FormResetPassword = ({ token }: { token: string }) => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  // Valores por defecto del formulario
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token,
      password: "",
      confirmPassword: "",
    },
  });

  // Función para manejar el submit del formulario
  const onSubmit = async (data: z.infer<typeof resetPasswordSchema>) => {
    startTransition(async () => {
      // Limpiamos el error
      setError(null);

      if (data.password !== data.confirmPassword) {
        setError("Las contraseñas no coinciden");
        return;
      }

      // Si las contraseñas coinciden, llamamos a la acción de resetear la contraseña
      const result = await resetPasswordAction(data);

      // Si hay un error, lo seteamos para mostrarlo al usuario
      if (result.error) {
        setError(result.error);
      } else {
        setSuccess(true);
      }
    });
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center px-6">
        <div className="bg-green-500/10 p-4 rounded-full mb-4">
          <Check className="size-10 text-green-500" />
        </div>

        <h1 className="text-2xl font-semibold mb-2">
          ¡Contraseña actualizada!
        </h1>
        <p className="text-sm text-neutral-600 mb-6">
          Tu contraseña ha sido restablecida correctamente. Ahora podés iniciar
          sesión con tu nueva clave.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="token"
          render={({ field }) => (
            <FormItem className="hidden">
              <FormLabel>Token</FormLabel>
              <FormControl>
                <Input
                  className="rounded-xl h-11 bg-muted/60 border border-border shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-muted-foreground text-foreground px-4 hidden"
                  {...field}
                  value={token}
                  disabled
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input
                  className="rounded-xl h-11 bg-muted/60 border border-border shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-muted-foreground text-foreground px-4"
                  placeholder="Contraseña"
                  {...field}
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar contraseña</FormLabel>
              <FormControl>
                <Input
                  className="rounded-xl h-11 bg-muted/60 border border-border shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-muted-foreground text-foreground px-4"
                  placeholder="Confirmar contraseña"
                  {...field}
                  type="password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && <FormMessage className="text-red-500">{error}</FormMessage>}

        <Button
          size="loginSize"
          type="submit"
          disabled={isPending}
          className="w-full rounded-xl bg-primary text-primary-foreground font-semibold shadow-md hover:bg-primary/90 transition-all h-11 text-base"
        >
          {isPending ? (
            <>
              <Loader2 className="size-4 animate-spin" />
              Restableciendo contraseña...
            </>
          ) : (
            "Restablecer contraseña"
          )}
        </Button>
      </form>
    </Form>
  );
};
