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
    credits: true;
    isAdmin: true;
  };
}> & {
  ideaChatsCount: number;
  projectsCount: number;
};
