import { useMemo } from "react";
import { Label, Legend, Pie, PieChart } from "recharts";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResourceInstance } from "src/types/resourceInstance";
import CustomLegend from "./CustomLegend";
import { resourceInstanceStatusMap } from "src/constants/statusChipStyles/resourceInstanceStatus";
import { chipCategoryColors } from "src/constants/statusChipStyles";
import { useMediaQuery, useTheme } from "@mui/material";
import { useDynamicInnerRadius } from "./useDynamicInnerRadius";
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

const LifecycleStatusChart: React.FC<LifecycleStatusChartProps> = ({ instances }) => {
  const { ref, radius } = useDynamicInnerRadius();

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
    <div ref={ref} className="w-full min-w-[200px] max-w-xl aspect-square mx-auto">
      <ChartContainer config={chartConfig} className="w-full h-full">
        <PieChart>
          <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
          <Legend layout="vertical" verticalAlign="top" align="right" content={CustomLegend(chartConfig)} />
          <Pie data={chartData} dataKey="instances" nameKey="status" innerRadius={radius}>
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

export default LifecycleStatusChart;
