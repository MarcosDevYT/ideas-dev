"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserWithDetails } from "@/types/user-types";
import { ProfileOverviewTab } from "./tabs/profile-overview-tab";
import { ProfilePersonalizationTab } from "./tabs/profile-personalization-tab";
import { ProfileAccountTab } from "./tabs/profile-account-tab";

interface ProfileSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserWithDetails | null | undefined;
}

export function ProfileSettingsDialog({
  open,
  onOpenChange,
  user,
}: ProfileSettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl md:max-w-2xl lg:max-w-4xl 2xl:max-w-6xl max-h-[95vh]">
        <DialogHeader>
          <DialogTitle>Perfil y Configuración</DialogTitle>
          <DialogDescription>
            Administra tu perfil y preferencias de la aplicación.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="personalization">Personalización</TabsTrigger>
            <TabsTrigger value="configuration">Configuración</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileOverviewTab user={user} />
          </TabsContent>

          <TabsContent value="personalization">
            <ProfilePersonalizationTab user={user} />
          </TabsContent>

          <TabsContent value="configuration">
            <ProfileAccountTab />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
