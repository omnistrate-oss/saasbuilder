import dayjs from "dayjs";
import React, { FC, useMemo } from "react";
import {
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import LoadingSpinner from "src/components/LoadingSpinner/LoadingSpinner";
import ReChartContainer from "src/components/ReChartContainer/ReChartContainer";
import { ConsumptionUsagePerDay } from "src/types/consumption";

function formatDate(inputDate) {
  return dayjs.utc(inputDate).format("MMM DD");
}

type ConsumptionUsageChartProps = {
  usagePerDayData  : ConsumptionUsagePerDay ;
  isFetchingUsagePerDay: boolean;
}

 const ConsumptionUsageChart : FC<ConsumptionUsageChartProps> = (props) => {
  const {usagePerDayData, isFetchingUsagePerDay} = props

  const billingUsagePerDay = useMemo(() => {
    const usage = usagePerDayData?.usage || [];
    const dataHashByDate = Record<string>

    usage.forEach((item) =>{})

    console.log("Usage per day data", usagePerDayData);
  }, [usagePerDayData]);

  console.log("billingUsagePerDay", billingUsagePerDay);
  const keys = ["Memory GiB hours", "Storage GiB hours", "CPU core hours"];
  const COLORS = ["#3E97FF", "#10AA50", "#7239EA"];
  const translateX = [-17, -6, 5];

  const minWidth = useMemo(() => {
    if (billingUsagePerDay?.length < 10) {
      return 800;
    } else if (
      billingUsagePerDay?.length > 9 &&
      billingUsagePerDay?.length < 16
    ) {
      return 1200;
    } else if (
      billingUsagePerDay?.length > 15 &&
      billingUsagePerDay?.length < 20
    ) {
      return 1600;
    } else if (
      billingUsagePerDay?.length > 19 &&
      billingUsagePerDay?.length < 25
    ) {
      return 1800;
    } else {
      return 2300;
    }
  }, [billingUsagePerDay]);

  return isFetchingUsagePerDay ? (
    <LoadingSpinner />
  ) : (
    <ReChartContainer
      mt={2}
      debounce={100}
      height={370}
      sx={{
        overflowX: "auto",
        scrollbarWidth: "thin",
        scrollbarColor: "#24273C",
        "&::-webkit-scrollbar": {
          width: "6px ",
          height: "12px",
        },
        "&::-webkit-scrollbar-thumb": {
          background: "#999a9f",
          borderRadius: "6px",
          border: "1px solid #999a9f",
        },
        "&::-webkit-scrollbar-track": {
          background: " #24273C",
          borderRadius: "6px",
        },
        "&::-webkit-scrollbar-thumb:hover": {
          background: "#eaecf0",
        },
      }}
    >
      <ResponsiveContainer height={350} minWidth={minWidth}>
        <ComposedChart
          data={billingUsagePerDay}
          barCategoryGap={50} // Controls the space between groups of bars
          barGap={1} // Ensures bars within the same group have no gap
          margin={{ bottom: 50, top: 5 }}
        >
          <CartesianGrid strokeDasharray="5 5" vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            interval={0}
            tick={({ x, y, payload }) => (
              <text
                x={x}
                y={y}
                dy={15}
                dx={21}
                textAnchor="end"
                style={{
                  fontSize: 13,
                  lineHeight: 14,
                  fontWeight: 600,
                  fill: "#7E8299",
                }}
              >
                {formatDate(payload.value)}
              </text>
            )}
          />

          <YAxis
            tickFormatter={(value) => `${value}`}
            domain={([, datamax]) => [
              0,
              datamax > 0 ? Math.round(datamax + 1) : 1,
            ]}
            interval={0}
            tick={({ x, y, payload }) => (
              <text
                x={x}
                y={y}
                dy={5}
                textAnchor="end"
                style={{
                  fontSize: 13,
                  lineHeight: 14,
                  fontWeight: 600,
                  fill: "#7E8299", // Apply color here
                }}
              >
                {payload.value}
              </text>
            )}
            tickLine={false}
            axisLine={false}
          />

          <Tooltip
            content={({ payload, label }) => {
              if (!payload || payload.length === 0) return null;

              // Define keys for line chart data
              const lineKeys = new Set(); // Use a Set for better performance

              // Filter only line data
              const filteredData = payload.filter((entry) => {
                const dataKey = String(entry.dataKey);
                if (!lineKeys.has(dataKey)) {
                  lineKeys.add(dataKey); // Add key to Set
                  return true; // Keep this entry
                }
                return false; // Ignore duplicates
              });

              if (filteredData.length === 0) return null; // Don't show tooltip if no line data

              return (
                <div
                  style={{
                    background: "#fff",
                    padding: "10px",
                    borderRadius: "4px",
                    boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontWeight: "bold",
                      fontSize: 14,
                      color: "#7E8299",
                    }}
                  >
                    {formatDate(label)}
                  </p>
                  {filteredData.map((entry) => (
                    <p
                      key={entry.dataKey}
                      style={{
                        color: entry.color,
                        margin: 0,
                        fontSize: 13,
                        fontWeight: 400,
                      }}
                    >
                      {entry.name}: {entry.value}
                    </p>
                  ))}
                </div>
              );
            }}
          />

          {/* Dynamically Render Bars */}
          {keys.map((key, index) => (
            <Bar
              key={`bar-${key}`}
              dataKey={key}
              barSize={10}
              fill={COLORS[index % COLORS.length]}
              radius={[4, 4, 4, 4]}
            />
          ))}

          {/* Dynamically Render Lines with Active Dots */}
          {keys.map((key, index) => (
            <Line
              id={`line-${key}`}
              key={`line-${key}`}
              type="monotone"
              dataKey={key}
              stroke={COLORS[index % COLORS.length]}
              strokeDasharray="3 3"
              dot={false}
              activeDot={(props) => (
                <circle
                  {...props}
                  transform={`translate(${translateX[index]}, 0)`}
                  r={4}
                  fill={COLORS[index % COLORS.length]}
                />
              )}
              transform={`translate(${translateX[index]}, 0)`}
            />
          ))}
        </ComposedChart>
      </ResponsiveContainer>
    </ReChartContainer>
  );
}

export default ConsumptionUsageChart;