import { createTheme } from "@mui/material/styles";

import { styleConfig } from "src/providerConfig";

export const theme = createTheme({
  palette: {
    primary: {
      main: styleConfig.primaryColor,
      hover: styleConfig.primaryHoverColor,
    },
    secondary: {
      main: "#004D40",
    },
    error: {
      main: "#EF4444",
      300: "#FCA5A5",
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
      md: 600,
      lg: 1136,
      mobile: 0,
      tablet: 600,
      desktop: 1136,
      maxContent: 1216,
    },
  },
});
