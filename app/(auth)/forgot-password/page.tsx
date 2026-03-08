import { FormEmailSend } from "@/components/authComponents/FormEmailSend";
import { LogoComponent } from "@/components/LogoComponent";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const dynamic = "force-static";

export default function ForgotPasswordPage() {
  return (
    <div className="flex h-screen pt-16 items-center justify-center bg-background">
      <Card className="w-full max-w-lg shadow-lg border border-border">
        <CardHeader className="flex flex-col items-center gap-2">
          <span className="text-xs font-semibold text-secondary-foreground bg-secondary rounded-full px-3 py-1">
            Recuperar Contraseña
          </span>
          <LogoComponent width={100} height={100} className="text-4xl mb-2" />
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
