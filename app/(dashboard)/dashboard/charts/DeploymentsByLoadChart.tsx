import { useMemo } from "react";
import { Label, Legend, Pie, PieChart } from "recharts";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResourceInstance } from "src/types/resourceInstance";
import CustomLegend from "./CustomLegend";

type DeploymentsByLoadChartProps = {
  instances: ResourceInstance[];
};

const chartConfig = {
  instances: {
    label: "Instances",
  },
  LOAD_NORMAL: {
    label: "Load Normal",
    color: "#9E77ED",
  },
  LOAD_IDLE: {
    label: "Load Idle",
    color: "#9E77ED",
  },
  LOAD_OVERLOADED: {
    label: "Load Overloaded",
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

const DeploymentsByLoadChart: React.FC<DeploymentsByLoadChartProps> = ({ instances }) => {
  const chartData = useMemo(() => {
    const statusCountsObj = instances.reduce((acc, curr) => {
      const loadStatus = curr.instanceLoadStatus;
      if (!loadStatus) return acc;

      if (!acc[loadStatus]) {
        acc[loadStatus] = 0;
      }

      acc[loadStatus]++;
      return acc;
    }, {});

    return Object.entries(statusCountsObj).map(([key, value]) => ({
      loadStatus: key,
      instances: value,
      fill: chartConfig[key]?.color || "#7F56D9",
    }));
  }, [instances]);

  return (
    <ChartContainer config={chartConfig} className="mx-auto aspect-square">
      <PieChart>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Legend layout="vertical" verticalAlign="top" align="right" content={CustomLegend(chartConfig)} />

        <Pie data={chartData} dataKey="instances" nameKey="loadStatus" innerRadius={80}>
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

export default DeploymentsByLoadChart;
