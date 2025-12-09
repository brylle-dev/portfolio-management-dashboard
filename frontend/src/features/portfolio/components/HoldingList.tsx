import { useState } from "react";
import type { PortfolioOverview } from "../types/portfolio.types";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TransactionDialog } from "@/features/transaction/components/TransactionDialog";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";

import { cn } from "@/lib/utils";

const HoldingList = ({
  portfolio,
  selectedPortfolioId,
  onSuccess,
  pageSize = 5,
}: {
  portfolio: PortfolioOverview[];
  selectedPortfolioId: string;
  onSuccess: () => void;
  pageSize?: number;
}) => {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(portfolio.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const pageData = portfolio.slice(startIndex, startIndex + pageSize);

  return (
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
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {pageData.map((p) => (
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
                    ${p.currentValue ? Number(p.currentValue).toFixed(2) : "-"}
                  </TableCell>
                  <TableCell
                    className={cn(
                      p.unrealizedPnl && Number(p.unrealizedPnl) >= 0
                        ? "text-green-500"
                        : "text-red-500"
                    )}
                  >
                    $
                    {p.unrealizedPnl ? Number(p.unrealizedPnl).toFixed(2) : "-"}
                  </TableCell>
                  <TableCell>
                    <TransactionDialog
                      portfolioId={selectedPortfolioId}
                      defaultInstrument={{
                        id: p.instrumentId,
                        symbol: p.symbol,
                        name: p.name,
                      }}
                      defaultTxnType="sell"
                      triggerLabel="Edit"
                      onSuccess={onSuccess}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* PAGINATION */}
      <div className="mt-4">
        <Pagination>
          <PaginationContent>
            {/* Previous */}
            <PaginationItem>
              <PaginationPrevious
                onClick={() => page > 1 && setPage(page - 1)}
                className={page === 1 ? "pointer-events-none opacity-50" : ""}
              />
            </PaginationItem>

            {/* Page numbers */}
            {Array.from({ length: totalPages }, (_, idx) => {
              const p = idx + 1;
              return (
                <PaginationItem key={p}>
                  <PaginationLink
                    isActive={p === page}
                    onClick={() => setPage(p)}
                  >
                    {p}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {/* Next */}
            <PaginationItem>
              <PaginationNext
                onClick={() => page < totalPages && setPage(page + 1)}
                className={
                  page === totalPages ? "pointer-events-none opacity-50" : ""
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </section>
  );
};

export default HoldingList;
