import { useEffect } from "react";
import { WelcomeScreen } from "@/features/portfolio/components/WelcomeScreen";
import { usePortfolios } from "@/features/portfolio/hooks/usePortfolio";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { usePortfolioStore } from "@/features/portfolio/store/portfolio.store";

export const Route = createFileRoute("/_protected/dashboard/")({
  component: RouteComponent,
});

function RouteComponent() {
  const { data: portfolios = [], isLoading } = usePortfolios();
  const { selectedPortfolioId } = usePortfolioStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && portfolios.length > 0) {
      // redirect to first portfolio
      navigate({
        to: "/dashboard/portfolio/$id",
        params: {
          id: selectedPortfolioId ? selectedPortfolioId : portfolios[0].id,
        },
      });
    }
  }, [isLoading, portfolios, navigate]);
  return <WelcomeScreen />;
}
