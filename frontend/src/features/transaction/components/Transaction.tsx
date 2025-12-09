import { Card } from "@/components/ui/card";
import { usePortfolioStore } from "@/features/portfolio/store/portfolio.store";
import { useTransactions } from "../hooks/useTransaction";
import { TransactionTable } from "./TransactionTable";

export default function Transaction() {
  const { selectedPortfolioId } = usePortfolioStore();
  const { data = [], isLoading } = useTransactions(
    selectedPortfolioId ?? undefined
  );

  if (!selectedPortfolioId) return null;
  if (isLoading) return <p>Loading transactions...</p>;

  return (
    <Card className="border-0 shadow-md w-full">
      <div className="min-w-full overflow-x-auto">
        <TransactionTable data={data} />
      </div>
    </Card>
  );
}
