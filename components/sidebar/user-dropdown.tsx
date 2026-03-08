"use client";

import { useState, useEffect } from "react";
import {
  ChevronUp,
  Settings,
  CreditCard,
  FileText,
  Shield,
  LifeBuoy,
  Bug,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { ProfileSettingsDialog } from "@/components/dialogs/profile-settings-dialog";
import { UpgradePlanDialog } from "@/components/dialogs/upgrade-plan-dialog";
import { ReportBugDialog } from "@/components/dialogs/report-bug-dialog";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { UserWithDetails } from "@/types/user-types";
import { getPublicPlansAction } from "@/actions/plans/plan-actions";
import Link from "next/link";

interface UserDropdownProps {
  user: UserWithDetails;
  isSidebarOpen?: boolean;
  isSheet?: boolean;
}

export function UserDropdown({
  user,
  isSidebarOpen,
  isSheet,
}: UserDropdownProps) {
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showUpgradeDialog, setShowUpgradeDialog] = useState(false);
  const [showBugDialog, setShowBugDialog] = useState(false);
  const [dbPlanName, setDbPlanName] = useState<string | null>(null);

  // Fetch true plan name from DB if active subscription exists
  useEffect(() => {
    if (
      user.subscription?.status === "active" &&
      user.subscription.polarPriceId
    ) {
      getPublicPlansAction().then((res) => {
        if (res.success && res.subscriptions) {
          const plan = res.subscriptions.find(
            (p) => p.polarProductId === user.subscription!.polarPriceId,
          );
          if (plan) setDbPlanName(plan.name);
        }
      });
    }
  }, [user.subscription]);

  const getCreditsBadgeVariant = () => {
    const credits = user.credits || 0;
    if (credits >= 500) return "default";
    if (credits >= 100) return "secondary";
    return "destructive";
  };

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getPlanName = () => {
    if (user.subscription?.status === "active") {
      const periodEnd = user.subscription.currentPeriodEnd;
      if (periodEnd && new Date(periodEnd) < new Date()) return "Gratis";
      return dbPlanName || "Subscripción";
    }
    return "Gratis";
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full outline-none">
          <div
            className={cn(
              "w-full rounded-lg hover:bg-accent transition-all cursor-pointer",
              isSheet
                ? "p-2 flex items-center gap-3"
                : isSidebarOpen
                  ? "p-2 flex items-center gap-3"
                  : "p-0",
            )}
          >
            <Avatar className="size-9">
              <AvatarImage
                src={user.image || undefined}
                alt={user.name || "User"}
              />
              <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
            </Avatar>

            <div
              className={cn(
                isSheet
                  ? ""
                  : isSidebarOpen
                    ? "opacity-100"
                    : "opacity-0 sr-only",
                "transition-opacity duration-600 flex-1 text-left min-w-0",
              )}
            >
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">
                {user.email}
              </p>
            </div>

            <div
              className={cn(
                isSheet
                  ? ""
                  : isSidebarOpen
                    ? "opacity-100"
                    : "opacity-0 sr-only",
                "transition-opacity duration-600 flex items-center",
              )}
            >
              <ChevronUp className="size-4 text-muted-foreground" />
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="end" side="top">
          <DropdownMenuLabel>
            <div className="flex flex-col gap-1">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground font-normal">
                {user.email}
              </p>
              <div className="flex items-center justify-between gap-2 mt-2">
                <span className="text-xs text-muted-foreground">Créditos:</span>
                <Badge
                  variant={getCreditsBadgeVariant()}
                  className="text-[10px] px-1.5 py-0 h-4"
                >
                  {user.credits || 0}
                </Badge>
              </div>
              <div className="flex items-center justify-between gap-2 mt-1 mb-1">
                <span className="text-xs text-muted-foreground">Plan:</span>
                <Badge
                  variant="outline"
                  className="text-[10px] px-1.5 py-0 h-4 bg-primary/10 text-primary border-primary/20"
                >
                  {getPlanName()}
                </Badge>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => setShowProfileDialog(true)}>
              <Settings className="size-4 mr-2" />
              Perfil y Configuración
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowUpgradeDialog(true)}>
              <CreditCard className="size-4 mr-2" />
              Mejorar Plan
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem asChild>
              <Link href="/legal/terminos">
                <FileText className="size-4 mr-2" />
                Términos de Servicio
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/legal/privacidad">
                <Shield className="size-4 mr-2" />
                Política de Privacidad
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/centro-de-ayuda">
                <LifeBuoy className="size-4 mr-2" />
                Centro de Ayuda
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setShowBugDialog(true)}>
              <Bug className="size-4 mr-2" />
              Reportar Error
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => signOut()}
            className="text-destructive focus:text-destructive"
          >
            <LogOut className="size-4 mr-2" />
            Cerrar Sesión
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileSettingsDialog
        user={user}
        open={showProfileDialog}
        onOpenChange={setShowProfileDialog}
      />
      <UpgradePlanDialog
        open={showUpgradeDialog}
        onOpenChange={setShowUpgradeDialog}
        activePlanId={user.subscription?.polarPriceId || ""}
      />
      <ReportBugDialog open={showBugDialog} onOpenChange={setShowBugDialog} />
    </>
  );
}
