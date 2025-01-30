"use client";

import { useMemo } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
} from "recharts";
import {
  ChartContainer,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { ResourceInstance } from "src/types/resourceInstance";
import { resourceInstanceStatusMap } from "src/constants/statusChipStyles/resourceInstanceStatus";

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
      acc[key] = { label: value.label, color: "#7F56D9" };
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

    return Object.entries(statusCountsObj).map(([key, value]) => ({
      status: key,
      instances: value,
      fill: "#7F56D9",
    }));
  }, [instances]);

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
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar dataKey="instances" strokeWidth={2} radius={8} />
        </BarChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
};

export default LifecycleStatusChart;
