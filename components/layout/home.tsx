import { LogoComponent } from "../LogoComponent";
import { UserWithDetails } from "@/types/user-types";
import { buttonVariants } from "../ui/button";
import Link from "next/link";
import { Navbar } from "./navbar";

interface HomeProps {
  user: UserWithDetails;
}

export const Home = ({ user }: HomeProps) => {
  return (
    <>
      <Navbar user={user} />
      <main className="flex flex-col items-center justify-center min-h-screen space-y-8 p-4 text-center">
        <div className="space-y-4 max-w-2xl">
          <LogoComponent className="text-6xl" />
          <p className="text-lg text-muted-foreground">
            Genera, desarrolla y gestiona tus ideas de proyectos con el poder de
            la IA.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/chat"
            className={buttonVariants({
              size: "lg",
              className: "w-full sm:w-auto",
            })}
          >
            Comenzar Chat
          </Link>
          <Link
            href="/credits"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "w-full sm:w-auto",
            })}
          >
            Gestionar Créditos
          </Link>
        </div>
      </main>
    </>
  );
};
