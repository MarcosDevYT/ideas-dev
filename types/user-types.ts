import { Prisma } from "@prisma/client";

export type UserWithDetails = Prisma.UserGetPayload<{
  select: {
    id: true;
    name: true;
    email: true;
    image: true;
    emailVerified: true;
    role: true;
    stack: true;
    planCredits: true;
    extraCredits: true;
    subscription: {
      include: {
        plan: {
          select: {
            name: true;
          };
        };
      };
    };
  };
}> & {
  ideaChatsCount: number;
  projectsCount: number;
  credits: number;
  hasPassword?: boolean;
};
