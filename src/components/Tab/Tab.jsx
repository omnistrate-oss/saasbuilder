import MuiTabs, { tabsClasses } from "@mui/material/Tabs";
import MuiTab, { tabClasses } from "@mui/material/Tab";
import styled from "@emotion/styled";
import { styleConfig } from "src/providerConfig";
import { colors } from "src/themeConfig";

export const Tabs = styled(MuiTabs)({
  borderBottom: "1px solid #E1E3EA",
  minHeight: "32px",
  [`& .${tabsClasses.indicator}`]: {
    backgroundColor: "transparent",
  },
  [`& .${tabsClasses.scrollButtons}`]: {
    paddingBottom: 14,
  },
});

export const Tab = styled(MuiTab)({
  padding: 0,
  textTransform: "none",
  borderBottom: "0px solid #EAECF0",
  fontSize: 14,
  padding: "12px 4px !important",
  fontWeight: 600,
  color: "#717680",
  lineHeight: "20px",
  minWidth: "auto",
  minHeight: "32px",
  marginRight: "16px",
  borderBottom: "2px solid transparent",
  "&:hover": {
    borderBottom: `2px solid ${colors.blue600}`,
    color: colors.blue700,
  },
  [`&.${tabClasses.selected}`]: {
    borderBottom: `2px solid ${colors.blue600}`,
    color: colors.blue700,
  },
});
