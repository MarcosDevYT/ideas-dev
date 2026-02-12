"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";

import {
  bugReportSchema,
  BugReportInput,
} from "@/lib/zodSchemas/bugReportSchema";

/**
 * Submit a bug report
 */
export async function submitBugReportAction(data: BugReportInput) {
  try {
    const validated = bugReportSchema.safeParse(data);

    if (!validated.success) {
      return { error: "Invalid bug report data" };
    }

    const session = await auth();

    // Create bug report with optional user association
    await prisma.bugReport.create({
      data: {
        title: validated.data.title,
        description: validated.data.description,
        category: validated.data.category,
        userId: session?.user?.id, // Optional - can be null for anonymous reports
      },
    });

    return {
      success: true,
      message: "Bug report submitted successfully",
    };
  } catch (error) {
    console.error("Error submitting bug report:", error);
    return { error: "Failed to submit bug report" };
  }
}
