import { prisma } from "../../lib/db";

export const me = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id: id },
    select: {
      id: true,
      email: true,
      username: true,
      fullName: true,
      createdAt: true,
    },
  });

  return user;
};
