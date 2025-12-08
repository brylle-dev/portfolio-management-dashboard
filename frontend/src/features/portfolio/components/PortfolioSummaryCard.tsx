import { TrendingUp, TrendingDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import { cn } from "@/lib/utils";

const COLORS = ["#2563eb", "#16a34a", "#f59e0b", "#ef4444", "#8b5cf6"];

export function PortfolioSummaryCards({
  totalValue,
  totalPnL,
  assetBreakdown,
}: {
  totalValue: number;
  totalPnL: number;
  assetBreakdown: { name: string; value: number }[];
}) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:shadow-xs lg:px-6 sm:grid-cols-3">
      {/* Total Value */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total Value</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            ${totalValue.toFixed(2)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUp className="mr-1 h-4 w-4" />
              Portfolio
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            Current market valuation <TrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Based on latest asset prices
          </div>
        </CardFooter>
      </Card>

      {/* Unrealized PnL */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Unrealized PnL</CardDescription>
          <CardTitle
            className={cn(
              "text-2xl font-semibold tabular-nums @[250px]/card:text-3xl",
              totalPnL >= 0 ? "text-green-500" : "text-red-500"
            )}
          >
            {totalPnL >= 0 ? "+" : "-"}${Math.abs(totalPnL).toFixed(2)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {totalPnL >= 0 ? (
                <>
                  <TrendingUp className="mr-1 h-4 w-4" /> Gain
                </>
              ) : (
                <>
                  <TrendingDown className="mr-1 h-4 w-4" /> Loss
                </>
              )}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">
            {totalPnL >= 0 ? "Positive performance" : "Underperforming assets"}{" "}
            {totalPnL >= 0 ? (
              <TrendingUp className="size-4" />
            ) : (
              <TrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            {totalPnL >= 0
              ? "Your holdings are in profit"
              : "Your holdings are in loss"}
          </div>
        </CardFooter>
      </Card>

      {/* Asset Allocation */}
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Asset Allocation</CardDescription>
          <CardTitle className="text-2xl font-semibold @[250px]/card:text-3xl">
            Diversification
          </CardTitle>
          <CardAction>
            <Badge variant="outline">Overview</Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={assetBreakdown}
                dataKey="value"
                nameKey="name"
                innerRadius={45}
                outerRadius={70}
                paddingAngle={3}
              >
                {assetBreakdown.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="flex gap-2 font-medium">Portfolio distribution</div>
          <div className="text-muted-foreground">
            Visual breakdown of asset classes
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
