import { prisma } from "../../lib/db";

export const recomputePosition = async (
  portfolioId: string,
  instrumentId: string
): Promise<void> => {
  const txns = await prisma.transaction.findMany({
    where: {
      portfolioId,
      instrumentId,
    },
  });

  const qty = txns.reduce((acc, t) => {
    const q = Number(t.quantity);
    return acc + (t.txnType === "buy" ? q : -q);
  }, 0);

  const filteredTxnBuy = txns.filter((txn) => txn.txnType === "buy");

  const totalBuyQty = filteredTxnBuy.reduce(
    (acc, t) => acc + Number(t.quantity),
    0
  );

  const totalBuyCost = filteredTxnBuy.reduce(
    (acc, t) =>
      acc +
      Number(t.quantity) *
        (Number(t.unitPrice) +
          Number(t.fees) / Math.max(Number(t.quantity), 1e-9)),
    0
  );

  const avgCost = totalBuyCost > 0 ? totalBuyCost / totalBuyQty : 0;

  const latestPrice = await prisma.instrumentPrice.findFirst({
    where: { instrumentId },
    orderBy: { priceDate: "desc" },
  });

  const lastMarkPrice = latestPrice ? latestPrice.closePrice : null;
  const marketValue = lastMarkPrice
    ? (qty * Number(lastMarkPrice)).toFixed(2)
    : null;

  await prisma.position.upsert({
    where: {
      portfolioId_instrumentId: {
        portfolioId,
        instrumentId,
      },
    },
    update: {
      quantity: qty.toFixed(8),
      avgCost: avgCost.toFixed(6),
      lastMarkPrice: lastMarkPrice ?? undefined,
      marketValue: marketValue ?? undefined,
      updatedAt: new Date(),
    },
    create: {
      portfolioId,
      instrumentId,
      quantity: qty.toFixed(8),
      avgCost: avgCost.toFixed(6),
      lastMarkPrice: lastMarkPrice ?? undefined,
      marketValue: marketValue ?? undefined,
    },
  });
};
