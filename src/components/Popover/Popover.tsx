import { Popover as MuiPopover, popoverClasses, styled } from "@mui/material";
import { themeConfig } from "src/themeConfig";

const Popover = styled(MuiPopover)({
  [`& .${popoverClasses.paper}`]: {
    border: `1px solid ${themeConfig.colors.gray200}`,
    boxShadow:
      "0px 2px 2px -1px #0A0D120A, 0px 4px 6px -2px #0A0D1208, 0px 12px 16px -4px #0A0D1214",
    borderRadius: "8px",
  },
});

export default Popover;
