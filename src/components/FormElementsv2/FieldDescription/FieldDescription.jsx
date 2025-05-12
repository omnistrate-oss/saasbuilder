import React from "react";

import { Text } from "src/components/Typography/Typography";

function FieldDescription(props) {
  const { marginTop = "6px", children, ...restProps } = props;
  return (
    <Text size="small" weight="regular" mt={marginTop} color="#6f7174" {...restProps}>
      {children}
    </Text>
  );
}

export default FieldDescription;
