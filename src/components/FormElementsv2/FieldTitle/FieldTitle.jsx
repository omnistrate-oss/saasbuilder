import { Box, useTheme } from "@mui/material";
import React from "react";
import { Text } from "src/components/Typography/Typography";

const RequiredAsterisk = (props) => (
  <Box component="span" sx={{ color: "error.500" }} {...props}>
    *
  </Box>
);

function FieldTitle(props) {
  const { required, children, ...restProps } = props;
  const theme = useTheme();

  return (
    <Text size="small" weight="medium" color={theme.palette.gray["700"]} {...restProps}>
      {children} {required && <RequiredAsterisk />}
    </Text>
  );
}

export default FieldTitle;
