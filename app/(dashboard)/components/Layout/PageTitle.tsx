import clsx from "clsx";
import { FC } from "react";
import { DisplayText } from "src/components/Typography/Typography";

type PageTitleProps = {
  children: React.ReactNode;
  icon: React.ElementType;
} & React.HTMLAttributes<HTMLDivElement>;

const PageTitle: FC<PageTitleProps> = ({
  children,
  icon: Icon,
  className,
  ...otherProps
}) => {
  return (
    <div className={clsx("flex items-center gap-2", className)} {...otherProps}>
      <Icon />
      {/* @ts-ignore */}
      <DisplayText size="small" weight="semibold" color="#181D27">
        {children}
      </DisplayText>
    </div>
  );
};

export default PageTitle;
