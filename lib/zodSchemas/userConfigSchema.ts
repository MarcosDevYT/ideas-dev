import { z } from "zod";

// ============================================
// Validation Schema
// ============================================
// Note: We use flexible string validation instead of enums
// to allow for easy addition of new roles and tech stacks
// without requiring schema changes

export const userConfigSchema = z.object({
  role: z.string().optional(),
  stack: z.array(z.string()).optional(),
});

export type UserConfigInput = z.infer<typeof userConfigSchema>;
