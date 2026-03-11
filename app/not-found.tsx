import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background/50 p-6 text-center">
      <div className="max-w-md space-y-8">
        {/* Abstract shape or icon could go here */}
        <div className="relative mx-auto h-24 w-24">
          <div className="absolute inset-0 animate-pulse rounded-full bg-primary/20" />
          <div className="relative flex h-full w-full items-center justify-center rounded-full border border-primary/20 bg-muted/50">
            <span className="font-syne text-4xl font-bold text-primary">
              404
            </span>
          </div>
        </div>

        <div className="space-y-3">
          <h1 className="font-syne text-4xl font-bold tracking-tight">
            Página no encontrada
          </h1>
          <p className="text-lg text-muted-foreground">
            Lo sentimos, no pudimos encontrar la página que estás buscando. Es
            posible que haya sido movida o eliminada.
          </p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
          <Button asChild variant="default" size="lg" className="h-12 px-8">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Volver al inicio
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="h-12 px-8">
            <Link href="/chat">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Regresar al chat
            </Link>
          </Button>
        </div>

        <div className="pt-8">
          <p className="text-sm text-muted-foreground/60 italic">
            &ldquo;A veces las mejores ideas surgen donde menos lo
            esperamos.&rdquo;
          </p>
        </div>
      </div>
    </div>
  );
}
