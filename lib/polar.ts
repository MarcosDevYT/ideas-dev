import { Polar } from "@polar-sh/sdk";

const isDev = process.env.NODE_ENV !== "production";

// ─── Cliente activo según el entorno ──────────────────────────────────────────
// En development → Sandbox | En production → Production
export const polar = new Polar({
  accessToken: isDev
    ? process.env.POLAR_SANDBOX_ACCESS_TOKEN
    : process.env.POLAR_PRODUCTION_ACCESS_TOKEN,
  server: isDev ? "sandbox" : "production",
});

// ─── Clientes explícitos para clonado cruzado ─────────────────────────────────
// Usados SOLO en la action de clonado (admin), no en el flujo normal de la app
export const polarSandbox = new Polar({
  accessToken: process.env.POLAR_SANDBOX_ACCESS_TOKEN,
  server: "sandbox",
});

export const polarProduction = new Polar({
  accessToken: process.env.POLAR_PRODUCTION_ACCESS_TOKEN,
  server: "production",
});

// ─── Helper de entorno ────────────────────────────────────────────────────────
export const currentPolarEnvironment = isDev ? "sandbox" : "production";
