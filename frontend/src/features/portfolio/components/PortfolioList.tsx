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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { ChartNoAxesCombined, ChevronRight } from "lucide-react";
import { usePortfolioStore } from "@/features/portfolio/store/portfolio.store";
import { usePortfolios } from "@/features/portfolio/hooks/usePortfolio";
import type { Portfolio } from "../types/portfolio.types";
import { useNavigate } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

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
        <Collapsible asChild defaultOpen={true} className="group/collapsible">
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton tooltip="Portfolio">
                <ChartNoAxesCombined />
                <span>Portfolio</span>
                <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
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
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      </SidebarMenu>
    </SidebarGroup>
  );
};

export default PortfolioList;
