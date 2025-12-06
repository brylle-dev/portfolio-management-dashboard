import { z } from "zod";

export const createTxnSchema = z.object({
  portfolioId: z.cuid(),
  instrumentId: z.cuid(),
  txnType: z.enum(["buy", "sell"]),
  quantity: z.string(),
  unitPrice: z.string(),
  fees: z.string().default("0"),
  tradeDate: z.string(),
  settlementDate: z.string().optional(),
  notes: z.string().optional(),
});

export type CreateTxnDto = z.infer<typeof createTxnSchema>;
