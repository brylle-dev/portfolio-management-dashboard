import { prisma } from "../../lib/db";

export const listPortfolios = async (
  userId: string
): Promise<Array<{ id: string; name: string; baseCurrency: string }>> => {
  const rows = await prisma.portfolio.findMany({
    where: { userId },
    select: {
      id: true,
      name: true,
      baseCurrency: true,
    },
  });
  return rows;
};
