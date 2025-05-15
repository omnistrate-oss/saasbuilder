import { useMemo } from "react";
import { Label, Legend, Pie, PieChart } from "recharts";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResourceInstance } from "src/types/resourceInstance";
import { getInstanceHealthStatus } from "./utlis";
import CustomLegend from "./CustomLegend";

type HealthStatusChartProps = {
  instances: ResourceInstance[];
};

const chartConfig = {
  instances: {
    label: "Instances",
  },
  DEGRADED: {
    label: "Degraded",
    color: "#9E77ED",
  },
  HEALTHY: {
    label: "Healthy",
    color: "#9E77ED",
  },
  UNHEALTHY: {
    label: "Unhealthy",
    color: "#7F56D9",
  },
  STOPPED: {
    label: "Stopped",
    color: "#7F56D9",
  },
  UNKNOWN: {
    label: "Unknown",
    color: "#E9EAEB",
  },
  "N/A": {
    label: "N/A",
    color: "#E9EAEB",
  },
} satisfies ChartConfig;

const HealthStatusChart: React.FC<HealthStatusChartProps> = ({ instances }) => {
  const chartData = useMemo(() => {
    const statusCountsObj = instances.reduce((acc, curr) => {
      //@ts-ignore
      const healthStatus = getInstanceHealthStatus(curr?.detailedNetworkTopology, curr?.status);

      if (!healthStatus) return acc;

      if (!acc[healthStatus]) {
        acc[healthStatus] = 0;
      }

      acc[healthStatus]++;
      return acc;
    }, {});

    return Object.entries(statusCountsObj).map(([key, value]) => ({
      healthStatus: key,
      instances: value,
      fill: chartConfig[key]?.color || "#7F56D9",
    }));
  }, [instances]);

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square ">
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Legend layout="vertical" verticalAlign="top" align="right" content={CustomLegend(chartConfig)} />

        <Pie data={chartData} dataKey="instances" nameKey="healthStatus" innerRadius={80}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle" dominantBaseline="middle">
                    <tspan x={viewBox.cx} y={viewBox.cy} className="fill-foreground text-3xl font-bold">
                      {instances?.length.toLocaleString()}
                    </tspan>
                    <tspan x={viewBox.cx} y={(viewBox.cy || 0) + 24} className="fill-muted-foreground">
                      Instances
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
};

export default HealthStatusChart;
