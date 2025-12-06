import { prisma } from "../../lib/db";
import { recomputePosition } from "../position/position.service";
import { CreateTxnDto } from "./transaction.types";

export const listTxns = async (portfolioId: string): Promise<unknown[]> => {
  const rows = await prisma.transaction.findMany({
    where: { portfolioId },
    orderBy: { tradeDate: "desc" },
    include: {
      instrument: {
        select: {
          symbol: true,
          name: true,
        },
      },
    },
  });

  return rows.map((row) => ({
    id: row.id,
    instrumentId: row.instrumentId,
    symbol: row.instrument.symbol,
    name: row.instrument.name,
    txnType: row.txnType,
    quantity: row.quantity.toString(),
    unitPrice: row.unitPrice.toString(),
    fees: row.fees.toString(),
    tradeDate: row.tradeDate.toISOString().slice(0, 10),
    settlementDate: row.settlementDate
      ? row.settlementDate.toISOString().slice(0, 10)
      : null,
    notes: row.notes ?? null,
  }));
};

export const createTxn = async (dto: CreateTxnDto): Promise<{ id: string }> => {
  const created = await prisma.transaction.create({
    data: {
      ...dto,
      tradeDate: new Date(dto.tradeDate),
      settlementDate: dto.settlementDate
        ? new Date(dto.settlementDate)
        : undefined,
    },
  });

  await recomputePosition(dto.portfolioId, dto.instrumentId);

  return {
    id: created.id,
  };
};
