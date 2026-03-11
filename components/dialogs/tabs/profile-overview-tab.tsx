import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { UserWithDetails } from "@/types/user-types";
import { FolderKanban, Mail, MessageSquare } from "lucide-react";

interface ProfileOverviewTabProps {
  user: UserWithDetails | null | undefined;
}

export function ProfileOverviewTab({ user }: ProfileOverviewTabProps) {
  const getUserInitials = () => {
    if (!user?.name) return "U";
    return user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getPlanBadge = () => {
    if (user?.role === "ADMIN") {
      return <Badge variant="secondary">Admin</Badge>;
    }
    
    const planName = user?.subscription?.plan?.name || "Gratuito";
    return <Badge variant="outline">Plan {planName}</Badge>;
  };

  return (
    <div className="space-y-6 py-4">
      {/* Avatar y Info Básica */}
      <div className="flex items-center gap-6">
        <Avatar className="h-24 w-24">
          <AvatarImage src={user?.image || undefined} />
          <AvatarFallback className="text-2xl bg-secondary text-secondary-foreground">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div>
            <h3 className="text-2xl font-semibold">
              {user?.name || "Usuario"}
            </h3>
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Mail className="h-4 w-4" />
              {user?.email}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {getPlanBadge()}
            {user?.emailVerified ? (
              <Badge
                variant="outline"
                className="bg-green-500/10 text-green-600 border-green-500/20"
              >
                Email Verificado
              </Badge>
            ) : (
              <Badge
                variant="outline"
                className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20"
              >
                Email No Verificado
              </Badge>
            )}
          </div>
        </div>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-2 gap-4">
        <div className="border rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <MessageSquare className="h-4 w-4" />
            <span className="text-sm">Ideas Creadas</span>
          </div>
          <p className="text-3xl font-bold text-secondary">
            {user?.ideaChatsCount || 0}
          </p>
        </div>
        <div className="border rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <FolderKanban className="h-4 w-4" />
            <span className="text-sm">Proyectos</span>
          </div>
          <p className="text-3xl font-bold text-secondary">
            {user?.projectsCount || 0}
          </p>
        </div>
      </div>

      {/* Créditos */}
      <div className="border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-semibold">Créditos Disponibles</h4>
            <p className="text-sm text-muted-foreground">
              {user?.role === "ADMIN"
                ? "Ilimitados (Admin)"
                : "Se recargan mensualmente"}
            </p>
          </div>
          <div className="text-3xl font-bold text-primary">
            {user?.role === "ADMIN" ? "∞" : user?.credits || 0}
          </div>
        </div>
      </div>
    </div>
  );
}
