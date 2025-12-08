import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import type { Transaction } from "../types/transaction.types";

export function TransactionTable({ data }: { data: Transaction[] }) {
  return (
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
        {data.map((t) => (
          <TableRow key={t.id}>
            <TableCell>{t.tradeDate}</TableCell>
            <TableCell className="font-semibold">{t.symbol}</TableCell>
            <TableCell>
              <Badge variant={t.txnType === "buy" ? "default" : "destructive"}>
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
  );
}
