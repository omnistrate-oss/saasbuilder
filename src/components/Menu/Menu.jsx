import { styled } from "@mui/material";
import MuiMenu, { menuClasses } from "@mui/material/Menu";

const Menu = styled(MuiMenu)(() => ({
  [`& .${menuClasses.paper}`]: {
    background: "#FFFFFF",
    border: "1px solid #EAECF0",
    boxShadow: "0px 12px 16px -4px rgba(16, 24, 40, 0.08), 0px 4px 6px -2px rgba(16, 24, 40, 0.03)",
    borderRadius: 8,
    minWidth: "140px",
    marginTop: 7,
  },
  [`& .${menuClasses.list}`]: {
    padding: 4,
    borderRadius: 8,
  },
}));

export default Menu;
