export interface Portfolio {
  id: string;
  name: string;
  baseCurrency: string;
}

export interface CreatePortfolioDto {
  name: string;
  baseCurrency: string;
}

export interface PortfolioOverview {
  instrumentId: string;
  symbol: string;
  name: string;
  assetClass: string;
  quantity: string;
  avgCost: string;
  latestPrice: string | null;
  currentValue: string | null;
  unrealizedPnl: string | null;
}
