import { createTheme } from "@mui/material/styles";

import { styleConfig } from "src/providerConfig";

export const theme = createTheme({
  palette: {
    primary: {
      main: styleConfig.primaryColor,
      50: "#F9F5FF",
      300: "#D6BBFB",
      600: "#7F56D9",
      700: "#6941C6",
      800: "#53389E",
      hover: styleConfig.primaryHoverColor,
    },
    secondary: {
      main: "#F5F5FF",
    },
    error: {
      main: "#EF4444",
      300: "#FCA5A5",
      500: "#F04438",
    },
    info: {
      main: "#7F56D9",
      light: "#4FC3F7",
      dark: "#0288D1",
    },
    gray: {
      25: "#FCFCFD",
      50: "#F9FAFB",
      main: "#667085",
      100: "#F2F4F7",
      200: "#EAECF0",
      300: "#D0D5DD",
      400: "#98A2B3",
      500: "#667085",
      600: "#475467",
      700: "#344054",
      800: "#1D2939",
      900: "#101828",
    },
    neutral: {
      25: "#FCFAFF",
      50: "#F9F5FF",
      main: "#6b7280",
      100: "#F3F4F6",
      200: "#E5E7EB",
      300: "#D1D5DB",
      400: "#9CA3AF",
      500: "#6b7280",
      600: "#4B5563",
      700: "#374151",
      800: "#1F2937",
      900: "#111827",
    },
    text: {
      primary: "#111827",
      secondary: "#374151",
    },
  },
  typography: {
    fontFamily: "Inter, Arial, sans-serif",
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 320,
      md: 900,
      lg: 1637,
      xl: 2100,
      mobile: 0,
      tablet: 600,
      desktop: 1136,
      maxContent: 1216,
      xldesktop: 1300,
    },
  },
});
