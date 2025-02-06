import { FC } from "react";
import { cn } from "lib/utils";

const PageContainer: FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className,
  ...otherProps
}) => {
  return (
    <div className={cn("px-8 py-6 pb-12", className)} {...otherProps}>
      {children}
    </div>
  );
};

export default PageContainer;
