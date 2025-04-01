import { FC, useMemo } from "react";
import { Text } from "src/components/Typography/Typography";
import UsageDimensionCard from "./UsageDimensionCard";
import {
  ConsumptionUsage as ConsumptionUsageData,
  UsageDimension,
} from "src/types/consumption";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import useConsumptionUsagePerDay from "../hooks/useConsumptionUsagePerDay";
import ConsumptionUsageChart from "./ConsumptionUsageChart";

dayjs.extend(utc);

type UsageOverviewProps = {};

const UsageOverview: FC<UsageOverviewProps> = (props) => {
  const { data: usagePerDayData, isFetching: isFetchingUsagePerDay } =
    useConsumptionUsagePerDay({
        startDate : "2025-03-01T00:00:00Z",
        endDate : "2025-03-31T23:59:59Z",
        subscriptionID : "sub-IXiSGQ5w4L"
    });

  return (
    <div
      className="mt-[20px] border border-[#E9EAEB] rounded-[12px] bg-[#FFF]"
      style={{ boxShadow: "0px 1px 2px 0px var(#0A0D120D)" }}
    >
      <div className="py-[20px] px-[24px]">
        <div className="flex flex-row items-center">
          <div>
            <Text size="large" weight="semibold" color="#181D27">
              Consumption Usage Overview
            </Text>
            <Text size="xsmall" weight="medium" color="#414651">
              Per day usage overview
            </Text>
          </div>
        </div>
      </div>
      <div className="border-t border-[#E9EAEB] py-3 px-6">
        <ConsumptionUsageChart
          usagePerDayData={usagePerDayData}
          isFetchingUsagePerDay={isFetchingUsagePerDay}
        />
      </div>
    </div>
  );
};

export default UsageOverview;
