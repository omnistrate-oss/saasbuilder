import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { format, subMonths, startOfMonth } from "date-fns";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Text } from "src/components/Typography/Typography";
import { chipCategoryColors } from "src/constants/statusChipStyles";
import { resourceInstanceStatusMap } from "src/constants/statusChipStyles/resourceInstanceStatus";
import { ResourceInstance } from "src/types/resourceInstance";

const chartConfig = {
  instances: {
    label: "Instances",
  },
  ...Object.entries(resourceInstanceStatusMap).reduce(
    (acc, [key, value]) => {
      const categoryColor = chipCategoryColors[value.category];
      acc[key] = {
        label: value.label,
        color: categoryColor?.borderColor || "#7F56D9",
      };
      return acc;
    },
    {} as Record<string, { label: string; color: string }>
  ),
} satisfies ChartConfig;

type LifecycleStatusChartProps = {
  instances: ResourceInstance[];
};

const DeploymentsByAgeChart: React.FC<LifecycleStatusChartProps> = ({ instances }) => {
  const chartData = useMemo(() => {
    // last 12 months with year for grouping
    const monthsWithYear = Array.from({ length: 12 }).map((_, i) => format(subMonths(new Date(), 11 - i), "MMM yyyy"));

    const counts: Record<string, number> = monthsWithYear.reduce(
      (acc, month) => {
        acc[month] = 0;
        return acc;
      },
      {} as Record<string, number>
    );

    instances.forEach((instance) => {
      if (!instance.created_at) return;

      const createdAt = new Date(instance.created_at);
      const createdMonthYear = format(startOfMonth(createdAt), "MMM yyyy");

      if (counts.hasOwnProperty(createdMonthYear)) {
        counts[createdMonthYear]++;
      }
    });

    // Map to chart data, only month name (without year) shown in label
    return monthsWithYear.map((monthYear) => ({
      month: format(new Date(monthYear), "MMM ''yy"), // e.g., "May '24"
      instances: counts[monthYear],
    }));
  }, [instances]);
  if (!instances.length)
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Text>No Instances</Text>
      </div>
    );

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ChartContainer config={chartConfig}>
        <BarChart data={chartData} accessibilityLayer maxBarSize={20}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} tickMargin={10} axisLine={false} interval={0} />
          <YAxis allowDecimals={false} axisLine={false} />
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Bar
            dataKey="instances"
            strokeWidth={2}
            radius={8}
            maxBarSize={30}
            fill="#7F56D9"
            minPointSize={2} // <-- this helps show small bars for zero counts
          />
        </BarChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
};

export default DeploymentsByAgeChart;
