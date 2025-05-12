"use client";

import { useMemo } from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { ResourceInstance } from "src/types/resourceInstance";

type CloudProvidersChartProps = {
  instances: ResourceInstance[];
};

const CloudProvidersChart: React.FC<CloudProvidersChartProps> = ({ instances }) => {
  const awsRegionsObj = useMemo(() => {
    return instances.reduce((acc, curr) => {
      if (curr.cloud_provider !== "aws") return acc;

      if (!curr.region) return acc;

      if (!acc[curr.region]) {
        acc[curr.region] = 0;
      }

      acc[curr.region]++;
      return acc;
    }, {});
  }, [instances]);

  const gcpRegionsObj = useMemo(() => {
    return instances.reduce((acc, curr) => {
      if (curr.cloud_provider !== "gcp") return acc;

      if (!curr.region) return acc;

      if (!acc[curr.region]) {
        acc[curr.region] = 0;
      }

      acc[curr.region]++;
    }, {});
  }, [instances]);

  const chartData = useMemo(() => {
    return [
      {
        cloud: "AWS",
        ...awsRegionsObj,
      },
      {
        cloud: "GCP",
        ...gcpRegionsObj,
      },
    ];
  }, [awsRegionsObj, gcpRegionsObj]);

  const chartConfig = useMemo(() => {
    return {
      ...Object.keys(awsRegionsObj).reduce(
        (acc, region) => {
          acc[region] = {
            label: region,
            color: "#7F56D9",
          };
          return acc;
        },
        {} as Record<string, { label: string; color: string }>
      ),
    } satisfies ChartConfig;
  }, [awsRegionsObj, gcpRegionsObj]);

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ChartContainer config={chartConfig}>
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <Bar dataKey="ap-south-1" stackId="a" fill="#7F56D9" radius={[0, 0, 4, 4]} />
          <Bar dataKey="ca-central-1" stackId="a" fill="#7F560a" radius={[4, 4, 0, 0]} />
          <ChartTooltip
            content={
              <ChartTooltipContent
                hideLabel
                className="w-[180px]"
                formatter={(value, name, item, index) => (
                  <>
                    <div
                      className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                      style={
                        {
                          "--color-bg": `var(--color-${name})`,
                        } as React.CSSProperties
                      }
                    />
                    {chartConfig[name as keyof typeof chartConfig]?.label || name}
                    <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                      {value}
                    </div>
                    {/* Add this after the last item */}
                    {index === 1 && (
                      <div className="mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium text-foreground">
                        Total
                        <div className="ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums text-foreground">
                          {item.payload["ap-south-1"] + item.payload["ca-central-1"]}
                          <span className="font-normal text-muted-foreground">instances</span>
                        </div>
                      </div>
                    )}
                  </>
                )}
              />
            }
            cursor={false}
            defaultIndex={1}
          />
          <XAxis dataKey="cloud" tickLine={false} tickMargin={10} axisLine={false} />
          <YAxis allowDecimals={false} axisLine={false} />
        </BarChart>
      </ChartContainer>
    </ResponsiveContainer>
  );
};

export default CloudProvidersChart;
