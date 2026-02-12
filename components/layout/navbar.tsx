import { AuthComponent } from "../authComponents/AuthComponent";
import { LogoComponent } from "../LogoComponent";
import { UserWithDetails } from "@/types/user-types";
import { User } from "next-auth";

interface NavbarProps {
  user: UserWithDetails | User | null;
}

export const Navbar = ({ user }: NavbarProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 w-full h-16 bg-card">
      <nav className="container mx-auto px-4 flex flex-row items-center justify-between">
        <LogoComponent className="text-2xl" />

        <AuthComponent user={user} isHome={true} />
      </nav>
    </header>
  );
};
