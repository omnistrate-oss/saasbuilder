import { Box } from "@mui/material";
import { hexToRgb } from "src/utils/hexToRgb";

const RippleCircle = (props) => {
  const {
    size = 6,
    colorHex = "#000040",
    animationDuration = "0.8s",
    animationTimingFunction = "linear",
    animationIterationCount = "infinite",
    animationDelay = "0s",
    animationName = "ripple",
    sx = {},
    ...restProps
  } = props;

  const color = hexToRgb(colorHex) || "0,0,0";

  return (
    <Box
      sx={{
        width: size,
        height: size,
        backgroundColor: `rgb(${color})`,
        opacity: 1,
        animationName,
        animationDuration,
        animationTimingFunction,
        animationIterationCount,
        animationDelay,
        borderRadius: "50%",
        [`@keyframes ${animationName}`]: {
          "0%": {
            boxShadow: `0 0 0 0 rgba(${color}, 0.15), 
                  0 0 0 4px rgba(${color}, 0.15)`,
          },
          "100%": {
            boxShadow: `0 0 0 2px rgba(${color}, 0.15),
                   0 0 0 6px rgba(${color}, 0.15)`,
          },
        },
        ...sx,
      }}
      {...restProps}
    />
  );
};

export default RippleCircle;
