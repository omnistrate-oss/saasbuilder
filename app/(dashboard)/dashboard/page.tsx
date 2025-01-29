"use client";

import { useMemo } from "react";
import PageTitle from "../components/Layout/PageTitle";
import DashboardIcon from "../components/Icons/DashboardIcon";
import PageContainer from "../components/Layout/PageContainer";
import ClusterLocations from "src/features/Access/Dashboard/ClusterLocations";

import useInstances from "../instances/hooks/useInstances";
import ChartCard from "./components/ChartCard";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

const lifecycleStatusChartConfig = {
  status: {
    label: "Instances",
    color: "#7F56D9",
  },
  DEPLOYING: {
    label: "Deploying",
    color: "#7F56D9",
  },
} satisfies ChartConfig;

const DashboardPage = () => {
  const { data: instances = [], isLoading: isLoadingInstances } =
    useInstances();

  const lifecycleStatusChartData = useMemo(() => {
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

  console.log(instances, lifecycleStatusChartData);

  return (
    <PageContainer>
      <PageTitle icon={DashboardIcon} className="mb-6">
        Dashboard
      </PageTitle>

      <ClusterLocations
        resourceInstances={instances}
        isFetchingInstances={isLoadingInstances}
      />

      <div className="mt-8 grid lg:grid-cols-3 gap-3">
        <ChartCard title="Lifecycle Status Breakdown" className="lg:col-span-2">
          <ChartContainer
            config={lifecycleStatusChartConfig}
            className="w-full min-h-80"
          >
            <BarChart accessibilityLayer data={lifecycleStatusChartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="status"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  lifecycleStatusChartConfig[
                    value as keyof typeof lifecycleStatusChartConfig
                  ]?.label
                }
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />

              <Bar dataKey="instances" radius={4} strokeWidth={2} />
            </BarChart>
          </ChartContainer>
        </ChartCard>
      </div>
    </PageContainer>
  );
};

export default DashboardPage;
