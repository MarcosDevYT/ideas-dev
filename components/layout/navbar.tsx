import { AuthComponent } from "../authComponents/AuthComponent";
import { LogoComponent } from "../LogoComponent";
import { UserWithDetails } from "@/types/user-types";
import { User } from "next-auth";
import { ScrollHeader } from "./scroll-header";

interface NavbarProps {
  user: UserWithDetails | User | null;
}

export const Navbar = ({ user }: NavbarProps) => {
  return (
    <ScrollHeader>
      <nav className="h-full container mx-auto px-4 flex flex-row items-center justify-between">
        <LogoComponent className="text-2xl" />

        <AuthComponent user={user} isHome={true} />
      </nav>
    </ScrollHeader>
  );
};
