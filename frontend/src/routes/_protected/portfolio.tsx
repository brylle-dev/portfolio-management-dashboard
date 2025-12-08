import PortfolioOverview from "@/features/portfolio/components/PortfolioOverview";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_protected/portfolio")({
  component: RouteComponent,
});

function RouteComponent() {
  return <PortfolioOverview />;
}
