import PortfolioOverview from "@/features/portfolio/components/PortfolioOverview";
import { usePortfolioStore } from "@/features/portfolio/store/portfolio.store";

import { createFileRoute, useParams } from "@tanstack/react-router";
import { useEffect } from "react";

export const Route = createFileRoute("/_protected/dashboard/portfolio/$id")({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = useParams({ from: "/_protected/dashboard/portfolio/$id" });
  const setSelectedPortfolioId = usePortfolioStore(
    (state) => state.setSelectedPortfolioId
  );
  useEffect(() => {
    setSelectedPortfolioId(id);
  }, []);
  return <PortfolioOverview />;
}
