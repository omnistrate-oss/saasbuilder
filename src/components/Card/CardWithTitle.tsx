import clsx from "clsx";
import { colors } from "src/themeConfig";
import { Text } from "../Typography/Typography";

type CardWithTitleProps = {
  title: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>;

const CardWithTitle: React.FC<CardWithTitleProps> = ({
  title,
  children,
  className,
  ...otherProps
}) => {
  return (
    <div
      className={clsx(
        "bg-white rounded-xl border border-gray-200 shadow-[0_1px_2px_0_#0A0D120D]",
        className
      )}
      {...otherProps}
    >
      <div className="py-5 px-6 border-b border-gray-200">
        <Text size="large" weight="semibold" color={colors.purple700}>
          {title}
        </Text>
      </div>
      <div className="px-6 py-6">{children}</div>
    </div>
  );
};

export default CardWithTitle;
