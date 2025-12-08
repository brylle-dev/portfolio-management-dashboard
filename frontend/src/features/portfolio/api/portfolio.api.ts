import { api } from "@/lib/client";
import type {
  Portfolio,
  CreatePortfolioDto,
  PortfolioOverview,
} from "../types/portfolio.types";

export const listPortfolios = async (): Promise<Portfolio[]> => {
  const { data } = await api.get("/portfolio");
  return data;
};

export const createPortfolio = async (
  dto: CreatePortfolioDto
): Promise<{ id: string }> => {
  const { data } = await api.post("/portfolio", dto);
  return data;
};

export const getPortfolioOverview = async (
  portfolioId: string
): Promise<PortfolioOverview[]> => {
  const { data } = await api.get(`/portfolio/${portfolioId}/overview`);
  return data;
};
