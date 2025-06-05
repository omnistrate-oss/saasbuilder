import { useMemo } from "react";
import { Label, Legend, Pie, PieChart } from "recharts";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Text } from "src/components/Typography/Typography";
import { ResourceInstance } from "src/types/resourceInstance";

import CustomLegend from "./CustomLegend";
import { useDynamicInnerRadius } from "./useDynamicInnerRadius"; // ✅ Import your hook

type DeploymentsByLoadChartProps = {
  instances: ResourceInstance[];
};

const chartConfig = {
  instances: {
    label: "Instances",
  },
  LOAD_NORMAL: {
    label: "Normal",
    color: "#7BBC29",
  },
  LOAD_IDLE: {
    label: "Idle",
    color: "#B5C9C6",
  },
  LOAD_OVERLOADED: {
    label: "High",
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

const DeploymentsByLoadChart: React.FC<DeploymentsByLoadChartProps> = ({ instances }) => {
  const { ref, radius } = useDynamicInnerRadius(); // ✅ Get dynamic radius

  const chartData = useMemo(() => {
    const statusCountsObj = instances.reduce(
      (acc, curr) => {
        const loadStatus = curr.instanceLoadStatus;
        if (!loadStatus) return acc;

        if (!acc[loadStatus]) {
          acc[loadStatus] = 0;
        }

        acc[loadStatus]++;
        return acc;
      },
      {} as Record<string, number>
    );
    return Object.entries(statusCountsObj).map(([key, value]) => ({
      loadStatus: key,
      instances: value,
      fill: chartConfig[key]?.color || "#3498DB",
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
          <Pie data={chartData} dataKey="instances" nameKey="loadStatus" innerRadius={radius}>
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

export default DeploymentsByLoadChart;
