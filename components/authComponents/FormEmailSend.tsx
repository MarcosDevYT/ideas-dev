"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { forgotPasswordSchema } from "@/lib/zodSchemas/authSchema";
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
import { Loader2, MailCheck } from "lucide-react";
import { forgotPasswordAction } from "@/actions/auth-actions";

/**
 * Componente para enviar al email el reset de contraseña
 * @returns devolvemos un formulario para poder obtener los datos del email y poder enviar el mensaje
 */
export const FormEmailSend = () => {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [isPending, startTransition] = useTransition();

  // Valores por defecto del formulario
  const form = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  // Función para manejar el submit del formulario
  const onSubmit = async (data: z.infer<typeof forgotPasswordSchema>) => {
    startTransition(async () => {
      // Limpiamos el error y el success
      setSuccess(false);
      setError(null);

      // Llamamos a la acción de enviar el correo de restablecimiento de contraseña
      const result = await forgotPasswordAction(data);

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
          <MailCheck className="size-10 text-green-500" />
        </div>

        <h1 className="text-2xl font-semibold mb-2">
          ¡Correo enviado con éxito!
        </h1>
        <p className="text-sm text-neutral-600">
          Te hemos enviado un enlace para restablecer tu contraseña. Revisá tu
          bandeja de entrada o spam.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              Enviando correo...
            </>
          ) : (
            "Enviar correo"
          )}
        </Button>
      </form>
    </Form>
  );
};
