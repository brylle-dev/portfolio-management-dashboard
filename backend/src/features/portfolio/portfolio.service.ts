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

export const overview = async (portfolioId: string) => {
  const positions = await prisma.position.findMany({
    where: { portfolioId },
    include: {
      instrument: { select: { symbol: true, name: true, assetClass: true } },
    },
  });

  return positions.map((pos) => {
    const qty = Number(pos.quantity);
    const avgCost = Number(pos.avgCost);
    const marketValue = pos.marketValue ? Number(pos.marketValue) : null;
    const costBasis = qty * avgCost;
    const unrealizedPnl =
      marketValue !== null ? (marketValue - costBasis).toFixed(2) : null;

    return {
      instrumentId: pos.instrumentId,
      symbol: pos.instrument.symbol,
      name: pos.instrument.name,
      assetClass: pos.instrument.assetClass,
      quantity: pos.quantity.toString(),
      avgCost: pos.avgCost.toString(),
      latestPrice: pos.lastMarkPrice?.toString() ?? null,
      currentValue: pos.marketValue?.toString() ?? null,
      unrealizedPnl,
    };
  });
};
