import { z } from "zod";

export const planSchema = z.object({
  name: z.string().min(2, { message: "El nombre debe tener al menos 2 caracteres." }).max(50),
  description: z.string().min(5, { message: "La descripción debe tener al menos 5 caracteres." }).max(500),
  featuresText: z.string(),
  isPopular: z.boolean(),
  environment: z.enum(["sandbox", "production"]),
});

// Para creación necesitamos precio y créditos, para edición tal vez no, lo dividimos.
export const createPlanSchema = planSchema.extend({
  type: z.enum(["subscription", "credits"]),
  price: z.string().refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
    message: "El precio debe ser un número mayor o igual a 0.",
  }),
  credits: z.string().refine((val) => !isNaN(parseInt(val, 10)) && parseInt(val, 10) >= 1, {
    message: "Los créditos deben ser un número entero mayor o igual a 1.",
  }),
});

export const editPlanSchema = planSchema; // la edición permite editar metadata y features
