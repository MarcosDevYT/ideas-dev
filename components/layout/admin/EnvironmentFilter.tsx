"use client";

import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function EnvironmentFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentEnv = searchParams.get("env") || "all";

  const onValueChange = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (val === "all") {
      params.delete("env");
    } else {
      params.set("env", val);
    }
    router.push(`?${params.toString()}`);
  };

  return (
    <Select value={currentEnv} onValueChange={onValueChange}>
      <SelectTrigger className="w-[180px] bg-background">
        <SelectValue placeholder="Filtrar entorno" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">Todos los entornos</SelectItem>
        <SelectItem value="production">Producción</SelectItem>
        <SelectItem value="sandbox">Sandbox</SelectItem>
      </SelectContent>
    </Select>
  );
}
