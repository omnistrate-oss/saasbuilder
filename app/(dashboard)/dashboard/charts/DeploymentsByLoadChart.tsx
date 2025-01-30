import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useMemo } from "react";
import { Pie, PieChart } from "recharts";
import { ResourceInstance } from "src/types/resourceInstance";

type DeploymentsByLoadChartProps = {
  instances: ResourceInstance[];
};

const chartConfig = {
  instances: {
    label: "Instances",
  },
  POD_NORMAL: {
    label: "Pod Normal",
    color: "#7F56D9",
  },
  POD_IDLE: {
    label: "Pod Idle",
    color: "#7F56D9",
  },
  POD_OVERLOADED: {
    label: "Pod Overloaded",
    color: "#7F56D9",
  },
  STOPPED: {
    label: "Stopped",
    color: "#7F56D9",
  },
  UNKNOWN: {
    label: "Unknown",
    color: "#7F56D9",
  },
  "N/A": {
    label: "N/A",
    color: "#7F56D9",
  },
} satisfies ChartConfig;

const DeploymentsByLoadChart: React.FC<DeploymentsByLoadChartProps> = ({
  instances,
}) => {
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
      fill: "#7F56D9",
    }));
  }, [instances]);

  return (
    <ChartContainer
      config={chartConfig}
      className="mx-auto aspect-square max-h-[250px]"
    >
      <PieChart>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          data={chartData}
          dataKey="instances"
          nameKey="loadStatus"
          innerRadius={60}
        />
      </PieChart>
    </ChartContainer>
  );
};

export default DeploymentsByLoadChart;
