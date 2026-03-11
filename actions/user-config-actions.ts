"use server";

import { auth } from "@/auth";
import prisma from "@/lib/prisma";
import {
  userConfigSchema,
  type UserConfigInput,
} from "@/lib/zodSchemas/userConfigSchema";

/**
 * Update current user's configuration
 */
export async function updateUserConfigAction(values: UserConfigInput) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    // Validate input
    const validated = userConfigSchema.safeParse(values);
    if (!validated.success) {
      return { error: "Invalid configuration data" };
    }

    // Update user configuration
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        role: validated.data.role,
        stack: validated.data.stack,
      },
      select: {
        role: true,
        stack: true,
      },
    });

    return {
      success: true,
      data: {
        role: updatedUser.role,
        stack: updatedUser.stack,
      },
    };
  } catch (error) {
    console.error("Error updating user config:", error);
    return { error: "Failed to update user configuration" };
  }
}

/**
 * Change user password
 * TODO: Implement password change logic with bcrypt
 */
export async function changePasswordAction() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { error: "Unauthorized" };
    }

    // TODO: Implement password change logic
    // 1. Verify current password
    // 2. Hash new password
    // 3. Update user password

    return {
      error: "Password change not yet implemented",
    };
  } catch (error) {
    console.error("Error changing password:", error);
    return { error: "Failed to change password" };
  }
}
