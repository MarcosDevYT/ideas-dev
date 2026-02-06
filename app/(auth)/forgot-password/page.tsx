import { FormEmailSend } from "@/components/authComponents/FormEmailSend";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const dynamic = "force-static";

export default function ForgotPasswordPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-background">
      <Card className="w-full max-w-lg shadow-lg border border-border">
        <CardHeader className="flex flex-col items-center gap-2">
          <h1 className="text-3xl font-extrabold tracking-tight text-primary text-center mb-1">
            IdeasDev
          </h1>
          <span className="text-xs font-semibold text-secondary-foreground bg-secondary rounded-full px-3 py-1 mb-2">
            Recuperar Contraseña
          </span>
        </CardHeader>
        <CardContent className="space-y-6">
          <FormEmailSend />
          <div className="mt-4 text-center">
            <a href="/login" className="underline text-primary font-medium">
              Volver a iniciar sesión
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
