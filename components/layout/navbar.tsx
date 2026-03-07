import { AuthComponent } from "../authComponents/AuthComponent";
import { LogoComponent } from "../LogoComponent";
import { UserWithDetails } from "@/types/user-types";
import { User } from "next-auth";
import { ScrollHeader } from "./scroll-header";
import { Github } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface NavbarProps {
  user: UserWithDetails | User | null;
}

export const Navbar = ({ user }: NavbarProps) => {
  return (
    <ScrollHeader>
      <nav className="h-full max-w-[1920px] mx-auto px-4 md:px-8 lg:px-12 2xl:px-16 flex flex-row items-center justify-between">
        <Link href="/">
          <LogoComponent className="text-2xl" />
        </Link>

        <div className="flex items-center gap-2 sm:gap-4">
          <a
            href="https://github.com/MarcosDevYT/ideas-dev"
            target="_blank"
            rel="noreferrer"
            className={cn(
              buttonVariants({ variant: "ghost", size: "icon" }),
              "text-muted-foreground hover:text-foreground",
            )}
            title="Ver repositorio en GitHub"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </a>
          <AuthComponent user={user} isHome={true} />
        </div>
      </nav>
    </ScrollHeader>
  );
};
