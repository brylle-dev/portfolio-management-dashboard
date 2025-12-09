import { useMemo } from "react";

import { usePortfolioOverview } from "@/features/portfolio/hooks/usePortfolio";
import type { PortfolioOverview } from "../types/portfolio.types";
import { usePortfolioStore } from "../store/portfolio.store";
import Transaction from "@/features/transaction/components/Transaction";
import { PortfolioSummaryCards } from "./PortfolioSummaryCard";
import { TransactionDialog } from "@/features/transaction/components/TransactionDialog";
import HoldingList from "./HoldingList";

export default function PortfolioOverview() {
  const { selectedPortfolioId } = usePortfolioStore();

  const {
    data: portfolio = [],
    isLoading,
    isError,
    refetch,
  } = usePortfolioOverview(selectedPortfolioId ?? undefined);

  // Derived values
  const totalValue = useMemo(
    () =>
      portfolio.reduce(
        (sum: number, p: PortfolioOverview) =>
          sum + (p.currentValue ? Number(p.currentValue) : 0),
        0
      ),
    [portfolio]
  );

  const totalPnL = useMemo(
    () =>
      portfolio.reduce(
        (sum: number, p: PortfolioOverview) =>
          sum + (p.unrealizedPnl ? Number(p.unrealizedPnl) : 0),
        0
      ),
    [portfolio]
  );

  const assetBreakdown = useMemo(() => {
    const breakdownMap: Record<string, number> = {};
    portfolio.forEach((p) => {
      const value = p.currentValue ? Number(p.currentValue) : 0;
      breakdownMap[p.assetClass] = (breakdownMap[p.assetClass] || 0) + value;
    });
    return Object.entries(breakdownMap).map(([name, value]) => ({
      name,
      value,
    }));
  }, [portfolio]);

  if (!selectedPortfolioId)
    return <p className="text-gray-500">No portfolio selected.</p>;
  if (isLoading) return <p>Loading portfolio overview...</p>;
  if (isError)
    return <p className="text-red-500">Failed to load portfolio data.</p>;

  return (
    <div className="space-y-8 px-6 py-6 w-full max-w-[100vw] overflow-x-hidden box-border">
      <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Portfolio Overview
          </h1>
          <p className="text-sm text-muted-foreground">
            View your holdings, performance, and transaction history.
          </p>
        </div>

        <TransactionDialog
          portfolioId={selectedPortfolioId}
          triggerLabel="Add Investment"
          onSuccess={() => refetch()}
        />
      </header>

      {/* ---- Summary Cards ---- */}
      <PortfolioSummaryCards
        assetBreakdown={assetBreakdown}
        totalPnL={totalPnL}
        totalValue={totalValue}
      />

      {/* ---- Holdings ---- */}
      <HoldingList
        portfolio={portfolio}
        selectedPortfolioId={selectedPortfolioId}
        onSuccess={() => refetch()}
      />

      {/* ---- Transaction History ---- */}
      <section className="px-4 lg:px-6">
        <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
        <Transaction />
      </section>
    </div>
  );
}
