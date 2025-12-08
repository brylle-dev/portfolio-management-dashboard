import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { cn } from "@/lib/utils";
import { usePortfolioOverview } from "@/features/portfolio/hooks/usePortfolio";
import type { PortfolioOverview } from "../types/portfolio.types";
import { usePortfolioStore } from "../store/portfolio.store";
import Transaction from "@/features/transaction/components/Transaction";
import { PortfolioSummaryCards } from "./PortfolioSummaryCard";
import { TransactionDialog } from "@/features/transaction/components/TransactionDialog";

export default function PortfolioOverview() {
  const { selectedPortfolioId } = usePortfolioStore();

  const {
    data: portfolio = [],
    isLoading,
    isError,
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

  // ---- Loading / Error States ----
  if (!selectedPortfolioId)
    return <p className="text-gray-500">No portfolio selected.</p>;
  if (isLoading) return <p>Loading portfolio overview...</p>;
  if (isError)
    return <p className="text-red-500">Failed to load portfolio data.</p>;

  // ---- Render ----
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

        <div className="flex gap-2">
          <TransactionDialog portfolioId={selectedPortfolioId} />
        </div>
      </header>

      {/* ---- Summary Cards ---- */}
      <PortfolioSummaryCards
        assetBreakdown={assetBreakdown}
        totalPnL={totalPnL}
        totalValue={totalValue}
      />

      {/* ---- Holdings ---- */}
      <section className="px-4 lg:px-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold">Holdings</h2>
        </div>

        <Card className="overflow-x-auto border-0 shadow-md">
          <div className="min-w-full overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Symbol</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Asset Class</TableHead>
                  <TableHead>Qty</TableHead>
                  <TableHead>Avg Cost</TableHead>
                  <TableHead>Latest Price</TableHead>
                  <TableHead>Value</TableHead>
                  <TableHead>PnL</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {portfolio.map((p: PortfolioOverview) => (
                  <TableRow key={p.instrumentId}>
                    <TableCell className="font-semibold">{p.symbol}</TableCell>
                    <TableCell>{p.name}</TableCell>
                    <TableCell className="capitalize">
                      {p.assetClass.replace("_", " ")}
                    </TableCell>
                    <TableCell>{p.quantity}</TableCell>
                    <TableCell>${Number(p.avgCost).toFixed(2)}</TableCell>
                    <TableCell>
                      ${p.latestPrice ? Number(p.latestPrice).toFixed(2) : "-"}
                    </TableCell>
                    <TableCell>
                      $
                      {p.currentValue ? Number(p.currentValue).toFixed(2) : "-"}
                    </TableCell>
                    <TableCell
                      className={cn(
                        p.unrealizedPnl && Number(p.unrealizedPnl) >= 0
                          ? "text-green-500"
                          : "text-red-500"
                      )}
                    >
                      $
                      {p.unrealizedPnl
                        ? Number(p.unrealizedPnl).toFixed(2)
                        : "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </section>

      {/* ---- Transaction History ---- */}
      <section className="px-4 lg:px-6">
        <h2 className="text-2xl font-semibold mb-4">Transaction History</h2>
        <Transaction />
      </section>
    </div>
  );
}
