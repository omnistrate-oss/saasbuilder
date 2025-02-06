import React from "react";
import { Text } from "src/components/Typography/Typography";

type FormHeaderProps = {
  title: string;
  description: string;
} & React.HTMLAttributes<HTMLDivElement>;

const FormHeader: React.FC<FormHeaderProps> = ({
  title,
  description,
  ...otherProps
}) => {
  return (
    <div {...otherProps}>
      <Text size="large" weight="semibold" color="#181D27">
        {title}
      </Text>
      <Text size="small" weight="regular" color="#535862">
        {description}
      </Text>
    </div>
  );
};

export default FormHeader;
