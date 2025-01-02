import MuiTabs, { tabsClasses } from "@mui/material/Tabs";
import MuiTab, { tabClasses } from "@mui/material/Tab";
import styled from "@emotion/styled";
import { styleConfig } from "src/providerConfig";

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
  padding: "4px 6px 12px !important",
  fontWeight: 600,
  color: "#667085",
  lineHeight: "20px",
  minWidth: "auto",
  minHeight: "32px",
  [`&.${tabClasses.selected}`]: {
    borderBottom: `2px solid ${styleConfig.secondaryColor}`,
    color: styleConfig.secondaryColor,
  },
  "&:hover": {
    borderBottom: `2px solid ${styleConfig.secondaryColor}`,
    color: styleConfig.secondaryColor,
  },
});
