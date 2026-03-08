import { Polar } from "@polar-sh/sdk";

// Inicializa el cliente de Polar con el token de acceso
export const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN || "",
  server: "sandbox",
});
