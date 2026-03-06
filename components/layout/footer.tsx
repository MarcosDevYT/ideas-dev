import Link from "next/link";
import { cn } from "@/lib/utils";
import { Container } from "./container";
import { FooterIcon } from "lucide-react"; // placeholder for any icons you may add later

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border py-8">
      <Container className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} IdeasDev. Todos los derechos reservados.
        </div>
        <nav className="flex gap-4 text-sm">
          <Link href="/centro-de-ayuda" className={cn("hover:underline")}>
            Centro de Ayuda
          </Link>
          <Link href="/legal/terminos" className={cn("hover:underline")}>
            Términos y Condiciones
          </Link>
          <Link href="/legal/privacidad" className={cn("hover:underline")}>
            Política de Privacidad
          </Link>
        </nav>
      </Container>
    </footer>
  );
};
