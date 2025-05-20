import { useMemo } from "react";
import { Label, Legend, Pie, PieChart } from "recharts";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResourceInstance } from "src/types/resourceInstance";
import CustomLegend from "./CustomLegend";
import { useDynamicInnerRadius } from "./useDynamicInnerRadius"; // ✅ Import the hook
import { Text } from "src/components/Typography/Typography";
import { getInstanceHealthStatus } from "src/components/InstanceHealthStatusChip/InstanceHealthStatusChip";

type HealthStatusChartProps = {
  instances: ResourceInstance[];
};

const chartConfig = {
  instances: {
    label: "Instances",
  },
  DEGRADED: {
    label: "Degraded",
    color: "#FF975D",
  },
  HEALTHY: {
    label: "Healthy",
    color: "#7BBC29",
  },
  UNHEALTHY: {
    label: "Unhealthy",
    color: "#E1584A",
  },
  UNKNOWN: {
    label: "Unknown",
    color: "#727272",
  },
  "N/A": {
    label: "N/A",
    color: "#727272",
  },
} satisfies ChartConfig;

const HealthStatusChart: React.FC<HealthStatusChartProps> = ({ instances }) => {
  const { ref, radius } = useDynamicInnerRadius(); // ✅ Use hook

  const chartData = useMemo(() => {
    const statusCountsObj = instances.reduce(
      (acc, curr) => {
        //@ts-ignore
        const healthStatus = getInstanceHealthStatus(curr?.detailedNetworkTopology, curr?.status);

        if (!healthStatus) return acc;

        if (!acc[healthStatus]) {
          acc[healthStatus] = 0;
        }

        acc[healthStatus]++;
        return acc;
      },
      {} as Record<string, number>
    );

    return Object.entries(statusCountsObj).map(([key, value]) => ({
      healthStatus: key,
      instances: value,
      fill: chartConfig[key]?.color || "#7F56D9",
    }));
  }, [instances]);

  if (!instances.length)
    return (
      <div className="h-[300px] flex items-center justify-center">
        <Text>No Instances</Text>
      </div>
    );

  return (
    <div ref={ref} className="w-full min-w-[200px] max-w-xl aspect-square mx-auto">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Legend layout="vertical" verticalAlign="top" align="right" content={CustomLegend(chartConfig)} />

          <Pie data={chartData} dataKey="instances" nameKey="healthStatus" innerRadius={radius}>
            <Label
              content={({ viewBox }) => {
                if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                  // Dynamically calculate font size based on radius
                  const fontSize = "18px";
                  const fontWeight = "600";

                  return (
                    <text
                      x={viewBox.cx}
                      y={viewBox.cy}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      style={{ fontSize, fontWeight }}
                      className="fill-foreground"
                    >
                      {instances?.length.toLocaleString()}
                    </text>
                  );
                }
                return null;
              }}
            />
          </Pie>
        </PieChart>
      </ChartContainer>
    </div>
  );
};

export default HealthStatusChart;
