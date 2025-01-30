"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ResourceInstance } from "src/types/resourceInstance";
import { resourceInstanceStatusMap } from "src/constants/statusChipStyles/resourceInstanceStatus";
import { chipCategoryColors } from "src/constants/statusChipStyles";
import { Text } from "src/components/Typography/Typography";

const chartConfig = {
  instances: {
    label: "Instances",
  },
  // Create Something Like This
  // DELETING: {
  //   label: "Deleting",
  //   color: "#7F56D9",
  // },
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

const LifecycleStatusChart: React.FC<LifecycleStatusChartProps> = ({
  instances,
}) => {
  const chartData = useMemo(() => {
    const statusCountsObj = instances.reduce((acc, curr) => {
      const lifecycleStatus = curr.status;
      if (!lifecycleStatus) return acc;

      if (!acc[lifecycleStatus]) {
        acc[lifecycleStatus] = 0;
      }

      acc[lifecycleStatus]++;
      return acc;
    }, {});

    return Object.entries(statusCountsObj).map(([key, value]) => {
      return {
        status: key,
        instances: value,
        // @ts-ignore
        fill: chartConfig[key as keyof typeof chartConfig]?.color || "#7F56D9",
      };
    });
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
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="status"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) =>
              chartConfig[value as keyof typeof chartConfig]?.label
            }
          />

          <YAxis allowDecimals={false} axisLine={false} />
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar
            dataKey="instances"
            strokeWidth={2}
            radius={8}
            maxBarSize={100}
          />
        </BarChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
};

export default LifecycleStatusChart;
