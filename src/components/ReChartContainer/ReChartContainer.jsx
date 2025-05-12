import { Box } from "@mui/material";

const ReChartContainer = (props) => {
  const { height = 300, sx = {}, children, ...restProps } = props;

  return (
    <Box sx={{ width: "100%", height: height, position: "relative", ...sx }} {...restProps}>
      <Box
        sx={{
          width: "100%",
          height: "100%",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default ReChartContainer;
