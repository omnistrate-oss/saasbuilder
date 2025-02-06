import { colors } from "src/themeConfig";
import { Text } from "src/components/Typography/Typography";
import ChartIcon from "./ChartIcon";
import clsx from "clsx";

type ChartCardProps = {
  title: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  children,
  ...otherProps
}) => {
  return (
    <div
      {...otherProps}
      className={clsx(
        "border border-gray-200 shadow-[0_1px_2px_#0A0D120D] rounded-xl",
        otherProps.className
      )}
    >
      <div className="px-6 py-5 flex items-center gap-3 border-b border-gray-200">
        <ChartIcon />

        <Text size="large" weight="semibold" color={colors.gray900}>
          {title}
        </Text>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
};

export default ChartCard;
