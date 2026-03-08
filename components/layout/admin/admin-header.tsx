import { Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UserWithDetails } from "@/types/user-types";

interface AdminHeaderProps {
  user: UserWithDetails;
  title?: string;
}

function getInitials(name: string | null | undefined) {
  if (!name) return "A";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function AdminHeader({
  user,
  title = "Panel General",
}: AdminHeaderProps) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      {/* Título de la sección */}
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <h1 className="text-lg font-semibold">{title}</h1>
      </div>

      {/* Info del admin */}
      <div className="flex items-center gap-3">
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium leading-none">
            {user.name ?? "Administrador"}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{user.email}</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            variant="secondary"
            className="text-xs gap-1 bg-primary/10 text-primary border-primary/20"
          >
            <Shield className="h-2.5 w-2.5" />
            Admin
          </Badge>
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.image ?? undefined}
              alt={user.name ?? "Admin"}
            />
            <AvatarFallback className="text-xs bg-primary text-primary-foreground">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
