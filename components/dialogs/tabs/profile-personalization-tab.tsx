import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { USER_ROLES, TECH_STACKS } from "@/lib/constants/user-config";
import { UserWithDetails } from "@/types/user-types";
import { updateUserConfigAction } from "@/actions/user-config-actions";
import { toast } from "sonner";

interface ProfilePersonalizationTabProps {
  user: UserWithDetails | null | undefined;
}

export function ProfilePersonalizationTab({
  user,
}: ProfilePersonalizationTabProps) {
  // Inicializamos el estado directamente desde las props, pero usamos useEffect para sincronizar si cambian
  const [role, setRole] = useState<string>(user?.role || "");
  const [stack, setStack] = useState<string[]>(user?.stack || []);
  const [isLoading, setIsLoading] = useState(false);
  const [openStackPopover, setOpenStackPopover] = useState(false);

  // Sincronizar estado local solo cuando el prop 'user' cambia desde el servidor
  // Usamos el patrón de comparación para evitar que el estado local sea sobrescrito
  // por datos antiguos antes de que la revalidación del servidor se complete.
  useEffect(() => {
    if (user && !isLoading) {
      const dbRole = user.role || "";
      const dbStack = user.stack || [];

      // Sincronizar solo si hay una discrepancia real (datos externos cambiaron)
      setRole(prev => (prev !== dbRole ? dbRole : prev));
      
      setStack(prev => {
        const stacksAreEqual = JSON.stringify([...dbStack].sort()) === JSON.stringify([...prev].sort());
        return stacksAreEqual ? prev : dbStack;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.role, user?.stack, isLoading]); 

  const handleSaveConfig = async () => {
    setIsLoading(true);

    const result = await updateUserConfigAction({
      role: role || undefined,
      stack: stack.length > 0 ? stack : undefined,
    });

    setIsLoading(false);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Configuración actualizada exitosamente");
    }
  };

  const toggleStack = (value: string) => {
    setStack((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value],
    );
  };

  const removeStack = (value: string) => {
    setStack((prev) => prev.filter((s) => s !== value));
  };

  // Group tech stacks by category
  const groupedStacks = TECH_STACKS.reduce(
    (acc, tech) => {
      const category = tech.category || "Otros";
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(tech);
      return acc;
    },
    {} as Record<string, typeof TECH_STACKS>,
  );

  return (
    <div className="space-y-4 py-4">
      {/* Selector de Rol */}
      <div className="grid gap-2">
        <Label htmlFor="role">Tu Rol</Label>
        <Select value={role} onValueChange={setRole}>
          <SelectTrigger id="role">
            <SelectValue placeholder="Selecciona tu rol" />
          </SelectTrigger>
          <SelectContent>
            {USER_ROLES.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Selector de Stack Tecnológico */}
      <div className="grid gap-2">
        <Label>Stack Tecnológico</Label>
        <Popover
          open={openStackPopover}
          onOpenChange={setOpenStackPopover}
          modal={true}
        >
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openStackPopover}
              className="justify-between w-full"
            >
              {stack.length > 0
                ? `${stack.length} tecnología${stack.length > 1 ? "s" : ""} seleccionada${stack.length > 1 ? "s" : ""}`
                : "Selecciona tecnologías..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px] p-0" align="start">
            <Command>
              <CommandInput placeholder="Buscar tecnología..." />
              <CommandList className="max-h-[300px] overflow-y-auto">
                <CommandEmpty>No se encontraron tecnologías.</CommandEmpty>
                {Object.entries(groupedStacks).map(([category, techs]) => (
                  <CommandGroup key={category} heading={category}>
                    {techs.map((tech) => (
                      <CommandItem
                        key={tech.value}
                        value={tech.value}
                        onSelect={() => toggleStack(tech.value)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            stack.includes(tech.value)
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {tech.label}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Tags de tecnologías seleccionadas */}
        {stack.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2 p-3 border rounded-md bg-muted/30">
            {stack.map((techValue) => {
              const tech = TECH_STACKS.find((t) => t.value === techValue);
              return (
                <Badge
                  key={techValue}
                  variant="secondary"
                  className="gap-1 pr-1 bg-secondary/80 hover:bg-secondary"
                >
                  {tech?.label || techValue}
                  <button
                    onClick={() => removeStack(techValue)}
                    className="ml-1 rounded-full hover:bg-secondary-foreground/20 p-0.5"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              );
            })}
          </div>
        )}
      </div>

      <Button
        onClick={handleSaveConfig}
        disabled={isLoading}
        className="w-full mt-4"
      >
        {isLoading ? "Guardando..." : "Guardar Configuración"}
      </Button>
    </div>
  );
}
