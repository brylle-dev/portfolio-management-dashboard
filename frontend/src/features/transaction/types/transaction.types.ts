export type TxnType = "buy" | "sell";

export interface Transaction {
  id: string;
  instrumentId: string;
  symbol: string;
  name: string;
  txnType: TxnType;
  quantity: string;
  unitPrice: string;
  fees: string;
  tradeDate: string;
  settlementDate: string | null;
  notes: string | null;
}

export interface CreateTxnDto {
  portfolioId: string;
  instrumentId: string;
  txnType: TxnType;
  quantity: string;
  unitPrice: string;
  fees?: string;
  tradeDate: string;
  settlementDate?: string;
  notes?: string;
}
