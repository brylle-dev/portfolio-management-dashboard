import { prisma } from "../../lib/db";

export const listInstruments = async (
  q?: string
): Promise<
  Array<{ id: string; symbol: string; name: string; assetClass: string }>
> => {
  const where = q
    ? { OR: [{ symbol: { contains: q } }, { name: { contains: q } }] }
    : {};
  const rows = await prisma.instrument.findMany({
    where,
    select: { id: true, symbol: true, name: true, assetClass: true },
  });

  return rows;
};
