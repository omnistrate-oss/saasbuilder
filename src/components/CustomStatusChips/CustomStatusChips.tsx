import { Stack, SxProps, useTheme, Theme, Box } from "@mui/material";
import { Text } from "../Typography/Typography";
import { ReactNode } from "react";

type CustomStatusChipsProps = {
  icon?: ReactNode;
  children?: ReactNode;
  containerStyles?: SxProps<Theme>;
  textStyles?: SxProps<Theme>;
  iconStyles?: SxProps<Theme> & { alignItems?: string; display?: string };
};

export default function CustomStatusChips(props: CustomStatusChipsProps) {
  const {
    icon,
    children,
    containerStyles = {},
    textStyles = {},
    iconStyles = {},
  } = props;
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      gap="8px"
      alignItems="center"
      marginTop="8px"
      sx={{
        borderRadius: "16px",
        backgroundColor: "rgba(254, 251, 232, 1)",
        border: "1px solid rgba(254, 247, 195, 1)",
        padding: "5px 8px",
        width: "fit-content",
        ...containerStyles,
      }}
    >
      {icon && (
        <Box sx={{ display: "flex", alignItems: "center", ...iconStyles }}>
          {icon}
        </Box>
      )}
      <Text
        color={theme.palette.warning.main}
        weight="regular"
        size="small"
        sx={{
          color: "#B54708",
          display: "inline",
          ...textStyles,
        }}
      >
        {children}
      </Text>
    </Stack>
  );
}
