import { prisma } from "../../lib/db";
import { CreatePortfolioDto } from "./portfolio.types";

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

export const createPortfolio = async (
  userId: string,
  dto: CreatePortfolioDto
): Promise<{ id: string }> => {
  return await prisma.portfolio.create({ data: { userId, ...dto } });
};

export const overview = async (portfolioId: string): Promise<unknown[]> => {
  const positions = await prisma.position.findMany({
    where: { portfolioId },
    include: {
      instrument: {
        select: {
          symbol: true,
          name: true,
          assetClass: true,
        },
      },
    },
  });

  const result: Array<{
    instrumentId: string;
    symbol: string;
    name: string;
    assetClass: string;
    quantity: string;
    avgCost: string;
    latestPrice: string | null;
    currentValue: string | null;
    unrealizePnl: string | null;
  }> = [];

  for (const pos of positions) {
    const latest = await prisma.instrumentPrice.findFirst({
      where: {
        instrumentId: pos.instrumentId,
      },
      orderBy: { priceDate: "desc" },
    });
    const latestPrice = latest?.closePrice ?? null;
    const currentValue = latestPrice
      ? (Number(pos.quantity) * Number(latestPrice)).toFixed(2)
      : null;
    const costBasis = (Number(pos.quantity) * Number(pos.avgCost)).toFixed(2);
    const unrealized = currentValue
      ? (Number(currentValue) - Number(costBasis)).toFixed(2)
      : null;

    result.push({
      instrumentId: pos.instrumentId,
      ...pos.instrument,
      quantity: pos.quantity.toString(),
      avgCost: pos.avgCost.toString(),
      latestPrice: latestPrice ? latestPrice.toString() : null,
      currentValue,
      unrealizePnl: unrealized,
    });
  }

  return result;
};
