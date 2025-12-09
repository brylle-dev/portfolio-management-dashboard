import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import { ChartNoAxesCombined } from "lucide-react";
import { usePortfolioStore } from "@/features/portfolio/store/portfolio.store";
import { usePortfolios } from "@/features/portfolio/hooks/usePortfolio";
import type { Portfolio } from "../types/portfolio.types";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

import { PortfolioCreateDialog } from "./PortfolioDialog";

const PortfolioList = () => {
  const navigate = useNavigate();
  const { data: portfolios = [], isLoading, isError } = usePortfolios();
  const { selectedPortfolioId, setSelectedPortfolioId } = usePortfolioStore();

  if (isError)
    return <p className="p-2 text-red-500">Failed to load portfolios.</p>;

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            tooltip="Portfolio"
            className="flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <ChartNoAxesCombined />
              <span>Portfolio</span>
            </div>

            <PortfolioCreateDialog />
          </SidebarMenuButton>

          {isLoading ? (
            <p className="p-2">Loading portfolios...</p>
          ) : (
            <>
              <SidebarMenuSub>
                {portfolios.length === 0 ? (
                  <SidebarMenuSubItem>
                    <span className="text-gray-500">No portfolios yet</span>
                  </SidebarMenuSubItem>
                ) : (
                  portfolios.map((portfolio: Portfolio) => (
                    <SidebarMenuSubItem key={portfolio.id}>
                      <SidebarMenuSubButton
                        asChild
                        onClick={() => {
                          setSelectedPortfolioId(portfolio.id);
                          navigate({
                            to: `/dashboard/portfolio/${portfolio.id}`,
                          });
                        }}
                        className={cn(
                          "cursor-pointer",
                          selectedPortfolioId === portfolio.id
                            ? "bg-blue-100 text-accent"
                            : ""
                        )}
                      >
                        <span>{portfolio.name}</span>
                      </SidebarMenuSubButton>
                    </SidebarMenuSubItem>
                  ))
                )}
              </SidebarMenuSub>
            </>
          )}
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default PortfolioList;
