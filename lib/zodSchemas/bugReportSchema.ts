import { z } from "zod";

export const bugReportSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.enum(["UI", "API", "Performance", "Other"]),
});

export type BugReportInput = z.infer<typeof bugReportSchema>;
