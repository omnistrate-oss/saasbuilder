import { styled } from "@mui/material";
import MuiChip, { chipClasses } from "@mui/material/Chip";

import { textStyles, weights } from "../Typography/Typography";

const Chip = styled(
  (props) => {
    return <MuiChip {...props} />;
  },
  {
    shouldForwardProp: (prop) => {
      return prop !== "fontColor" && prop !== "bgColor" && prop !== "borderColor";
    },
  }
)(({ fontColor, bgColor, borderColor }) => ({
  height: "auto",
  padding: "2px 8px",
  background: bgColor ? bgColor : "#F9F5FF",
  border: borderColor ? `1px solid ${borderColor}` : " none",
  [`& .${chipClasses.label}`]: {
    paddingLeft: 0,
    paddingRight: 0,
    ...textStyles.small,
    fontWeight: weights.medium,
    color: fontColor ? fontColor : "#6941C6",
  },
  [`& .${chipClasses.labelSmall}`]: {
    fontSize: 12,
    lineHeight: "18px",
    fontWeight: 500,
  },
  [`& .${chipClasses.labelMedium}`]: {
    fontSize: 14,
    lineHeight: "20px",
    fontWeight: 500,
  },
  [`& .${chipClasses.icon}`]: {
    marginLeft: 0,
    marginRight: 4,
  },
}));

export default Chip;
