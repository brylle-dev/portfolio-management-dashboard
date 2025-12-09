import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as api from "../api/portfolio.api";
import type { Portfolio, PortfolioOverview } from "../types/portfolio.types";

export const usePortfolios = () =>
  useQuery<Portfolio[]>({
    queryKey: ["portfolios"],
    queryFn: api.listPortfolios,
  });

export const usePortfolioOverview = (portfolioId?: string) =>
  useQuery<PortfolioOverview[]>({
    queryKey: ["portfolioOverview", portfolioId],
    queryFn: () => api.getPortfolioOverview(portfolioId!),
    enabled: !!portfolioId,
  });

export const useCreatePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: api.createPortfolio,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["portfolios"] });
    },
  });
};
