import { api } from "@/lib/client";
import type { CreateTxnDto, Transaction } from "../types/transaction.types";

export const listTransactions = async (
  portfolioId: string
): Promise<Transaction[]> => {
  const { data } = await api.get(`/transaction/${portfolioId}/`);
  return data;
};

export const createTransaction = async (
  dto: CreateTxnDto
): Promise<{ id: string }> => {
  const { data } = await api.post("/transaction", dto);
  return data;
};
