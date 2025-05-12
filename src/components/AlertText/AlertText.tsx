import { ReactNode } from "react";
import { Stack, SxProps, Theme, useTheme } from "@mui/material";

import AlertTriangle from "src/components/Icons/AlertTriangle/AlertTriangle";
import { Text } from "src/components/Typography/Typography";

type AlertTextProps = {
  children: ReactNode;
  containerStyles?: SxProps<Theme>;
  textStyles?: SxProps<Theme>;
};

export default function AlertText(props: AlertTextProps) {
  const { children, containerStyles = {}, textStyles = {} } = props;
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      gap="8px"
      alignItems="center"
      marginTop="8px"
      sx={{
        borderRadius: "8px",
        backgroundColor: "#FFFAEB",
        border: "1px solid #D0D5DD",
        padding: "12px 14px",
        ...containerStyles,
      }}
    >
      <AlertTriangle color={theme.palette.warning.main} style={{ alignSelf: "normal", flexShrink: 0 }} />
      <Text color={theme.palette.warning.main} weight="regular" size="small" sx={{ color: "#B54708", ...textStyles }}>
        {children}
      </Text>
    </Stack>
  );
}
