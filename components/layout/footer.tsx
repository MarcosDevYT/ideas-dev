import Link from "next/link";
import { cn } from "@/lib/utils";
import { Github, Heart, Star } from "lucide-react";
import { LogoComponent } from "../LogoComponent";

export const Footer = () => {
  return (
    <footer className="bg-card border-t border-border flex flex-col md:flex-row items-center justify-between py-12 px-4 md:px-8 lg:px-12 2xl:px-16 mt-auto">
      <div className="flex flex-col items-center md:items-start gap-3">
        <LogoComponent className="text-2xl" />
        <div className="text-sm font-medium">
          © {new Date().getFullYear()} IdeasDev. Todos los derechos reservados.
        </div>
        <div className="text-sm text-muted-foreground flex items-center gap-1.5">
          Construido con <Heart className="h-4 w-4 text-red-500 fill-current" />{" "}
          por{" "}
          <a
            href="https://github.com/MarcosDevYT"
            target="_blank"
            rel="noreferrer"
            className="font-medium underline underline-offset-4 hover:text-primary transition-colors"
          >
            Marcos (MarcosDev)
          </a>
        </div>
      </div>

      <div className="flex flex-col items-center md:items-end gap-4">
        <a
          href="https://github.com/MarcosDevYT/ideas-dev"
          target="_blank"
          rel="noreferrer"
          className="group flex items-center gap-2 text-sm font-medium bg-secondary/50 hover:bg-secondary border border-border px-4 py-2 rounded-full transition-all hover:scale-105 shadow-sm"
        >
          <Github className="h-4 w-4" />
          <span>Déjanos una estrella en GitHub</span>
          <Star className="h-4 w-4 text-yellow-500 group-hover:fill-yellow-500 transition-colors" />
        </a>
        <nav className="flex flex-wrap justify-center gap-4 md:gap-6 text-sm text-muted-foreground">
          <Link
            href="/centro-de-ayuda"
            className={cn("hover:text-foreground transition-colors")}
          >
            Centro de Ayuda
          </Link>
          <Link
            href="/legal/terminos"
            className={cn("hover:text-foreground transition-colors")}
          >
            Términos
          </Link>
          <Link
            href="/legal/privacidad"
            className={cn("hover:text-foreground transition-colors")}
          >
            Privacidad
          </Link>
        </nav>
      </div>
    </footer>
  );
};
