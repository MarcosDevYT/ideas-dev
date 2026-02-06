"use client";

import { z } from "zod";
import { registerSchema } from "@/lib/zodSchemas/authSchema";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerAction } from "@/actions/auth-actions";
import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

/**
 * Formulario de registro
 * @returns Formulario de registro con email, nombre, contraseña y confirmar contraseña
 */

export const FormRegister = () => {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Valores por defecto del formulario
  const form = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Función para manejar el submit del formulario
  const onSubmit = async (data: z.infer<typeof registerSchema>) => {
    startTransition(async () => {
      // Limpiamos el error
      setError(null);

      // Llamamos a la acción de registro
      const result = await registerAction(data);

      // Si hay un error, lo seteamos para mostrarlo al usuario
      if (result.error) {
        setError(result.error);
      } else {
        router.push("/");
      }
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  className="rounded-xl h-11 bg-muted/60 border border-border shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-muted-foreground text-foreground px-4"
                  placeholder="Nombre"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  className="rounded-xl h-11 bg-muted/60 border border-border shadow-sm focus:border-primary focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-muted-foreground text-foreground px-4"
                  placeholder="Email"
                  {...field}
                  type="email"
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
              <FormLabel>Password</FormLabel>
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
              Cargando...
            </>
          ) : (
            "Registrarse"
          )}
        </Button>
      </form>
    </Form>
  );
};
