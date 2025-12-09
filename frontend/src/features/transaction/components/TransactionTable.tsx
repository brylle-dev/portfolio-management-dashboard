import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
  PaginationLink,
} from "@/components/ui/pagination";

import type { Transaction } from "../types/transaction.types";

export function TransactionTable({
  data,
  pageSize = 5,
}: {
  data: Transaction[];
  pageSize?: number;
}) {
  const [page, setPage] = useState(1);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIdx = (page - 1) * pageSize;
  const pageData = data.slice(startIdx, startIdx + pageSize);

  return (
    <div className="space-y-4">
      {/* TABLE */}
      <Table className="w-full table-auto">
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Symbol</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Qty</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Fees</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {pageData.map((t) => (
            <TableRow key={t.id}>
              <TableCell>{t.tradeDate}</TableCell>
              <TableCell className="font-semibold">{t.symbol}</TableCell>
              <TableCell>
                <Badge
                  variant={t.txnType === "buy" ? "default" : "destructive"}
                >
                  {t.txnType.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell>{t.quantity}</TableCell>
              <TableCell>${Number(t.unitPrice).toFixed(2)}</TableCell>
              <TableCell>${Number(t.fees).toFixed(2)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* PAGINATION */}
      <Pagination>
        <PaginationContent>
          {/* Previous */}
          <PaginationItem>
            <PaginationPrevious
              onClick={() => page > 1 && setPage(page - 1)}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {/* Page Numbers */}
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
  );
}
