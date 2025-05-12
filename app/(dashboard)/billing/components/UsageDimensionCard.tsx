import { FC } from "react";
import UsageDimensionIcon from "app/(dashboard)/components/Icons/UsageDimension";

import { Text } from "src/components/Typography/Typography";
import { UsageDimension } from "src/types/consumption";

type UsageDimensionCardProps = {
  dimensionName: UsageDimension;
  value: number;
  title: string;
};

const UsageDimensionCard: FC<UsageDimensionCardProps> = (props) => {
  const { dimensionName, value, title } = props;

  return (
    <div
      className="border border-[#E9EAEB] p-5 rounded-[12px] min-w-[249px] flex-1"
      style={{ boxShadow: "0px 1px 2px 0px #0A0D120D" }}
    >
      <div className="flex items-center gap-3">
        <div className="border border-[#E4E7EC] p-2 rounded-[10px]">
          <UsageDimensionIcon />
        </div>
        <div>
          <Text size="medium" weight="bold" color="#414651">
            {title}{" "}
          </Text>
          <Text size="small" weight="bold" color="#475467">
            {value} {dimensionName}
          </Text>
        </div>
      </div>
    </div>
  );
};

export default UsageDimensionCard;
