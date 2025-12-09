import { z } from "zod";

export const createPortfolioSchema = z.object({
  name: z.string().min(1),
  baseCurrency: z.string().length(3),
});

export type CreatePortfolioDto = z.infer<typeof createPortfolioSchema>;
