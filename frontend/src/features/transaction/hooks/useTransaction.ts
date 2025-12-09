import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTransaction, listTransactions } from "../api/transaction.api";

export const useTransactions = (portfolioId?: string) => {
  return useQuery({
    queryKey: ["transactions", portfolioId],
    queryFn: () => listTransactions(portfolioId!),
    enabled: !!portfolioId,
  });
};

export const useCreateTransaction = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: createTransaction,
    onSuccess: (_, txn) => {
      qc.invalidateQueries({ queryKey: ["transactions", txn.portfolioId] });
      qc.invalidateQueries({
        queryKey: ["portfolioOverview", txn.portfolioId],
      });
    },
  });
};
