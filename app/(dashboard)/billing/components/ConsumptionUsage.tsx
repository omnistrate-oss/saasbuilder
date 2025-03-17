import { FC, useMemo } from "react";
import { Text } from "src/components/Typography/Typography";
import UsageDimensionCard, { UsageDimension } from "./UsageDimensionCard";
import { ConsumptionUsagePerDay } from "src/types/consumption";

type ConsumptionUsageProps = {
  consumptionUsagePerDayData: ConsumptionUsagePerDay | undefined;
};

const ConsumptionUsage: FC<ConsumptionUsageProps> = (props) => {
  const { consumptionUsagePerDayData } = props;
  const aggregatedConsumptionDataHash = useMemo(() => {
    const hash: Record<
      UsageDimension,
      {
        total: number;
        dailyUsageData: { startTime: string; endTime: string; value: number }[];
      }
    > = {
      "Memory GiB hours": {
        total: 0,
        dailyUsageData: [],
      },
      "Storage GiB hours": {
        total: 0,
        dailyUsageData: [],
      },
      "CPU core hours": {
        total: 0,
        dailyUsageData: [],
      },
    };

    const usage = consumptionUsagePerDayData?.usage || [];

    usage.forEach((usageDatapoint) => {
      const { dimension, endTime, startTime, total } = usageDatapoint;
      if (dimension) {
        if (hash[dimension]) {
          hash[dimension] = {
            total: hash[dimension].total + (total !== undefined ? total : 0),
            dailyUsageData: [
              ...hash[dimension].dailyUsageData,
              {
                startTime: startTime as string,
                endTime: endTime as string,
                value: total !== undefined ? total : 0,
              },
            ],
          };
        } else {
          hash[usageDatapoint.dimension as string] = {
            total: total !== undefined ? total : 0,
            dailyUsageData: [
              {
                startTime: startTime as string,
                endTime: endTime as string,
                value: total !== undefined ? total : 0,
              },
            ],
          };
        }
      }
    });

    return hash;
  }, [consumptionUsagePerDayData]);

  console.log("aggregatedConsumptionDataHash", aggregatedConsumptionDataHash);

  return (
    <div
      className="mt-[20px] border border-[#E9EAEB] rounded-[12px] bg-[#FFF]"
      style={{ boxShadow: "0px 1px 2px 0px var(#0A0D120D)" }}
    >
      <div className="py-[20px] px-[24px]">
        <div className="flex flex-row items-center">
          <div>
            <Text size="large" weight="semibold" color="#181D27">
              Current Usage
            </Text>
            {/* <Text size="small" weight="regular" color="#535862">
              Description
            </Text> */}
          </div>
        </div>
      </div>
      <div className="border-t border-[#E9EAEB] py-3 px-6">
        <div className="flex gap-x-3 justify-center max-w-[900px] mx-auto">
          <UsageDimensionCard
            dimensionName="Memory GiB hours"
            value={aggregatedConsumptionDataHash["Memory GiB hours"].total}
          />
          <UsageDimensionCard
            dimensionName="Storage GiB hours"
            value={aggregatedConsumptionDataHash["Storage GiB hours"].total}
          />
          <UsageDimensionCard
            dimensionName="CPU core hours"
            value={aggregatedConsumptionDataHash["CPU core hours"].total}
          />
        </div>
      </div>
    </div>
  );
};

export default ConsumptionUsage;
