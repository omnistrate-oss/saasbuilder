import clsx from "clsx";
import { FC } from "react";

const PageContainer: FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...otherProps
}) => {
  return (
    <div className={clsx("px-8 py-6 pb-12", className)} {...otherProps}>
      {children}
    </div>
  );
};

export default PageContainer;
