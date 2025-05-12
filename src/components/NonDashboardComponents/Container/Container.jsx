import React from "react";
import { Box } from "@mui/material";
import { styled } from "@mui/material/styles";

//The outer spans full width, background to be added here
const Outer = styled(Box, {
  shouldForwardProp: (prop) =>
    prop !== "background" &&
    prop !== "mt" &&
    prop !== "mb" &&
    prop !== "bgImg" &&
    prop !== "fontColor" &&
    prop !== "bgColor" &&
    prop !== "noBottomBorder",
})(({ theme, bgColor, mt, mb, pt, pb, bgImg, fontColor, noBottomBorder }) => {
  return {
    backgroundColor: bgColor ? bgColor : "white",
    backgroundImage: bgImg ? bgImg : "",
    backgroundPosition: "right",
    backgroundRepeat: bgImg ? "repeat-y" : "no-repeat",
    backgroundRepeat: "no-repeat",
    backgroundSize: "contain",
    marginTop: mt ? mt : 0,
    marginBottom: mb ? mb : 0,
    color: fontColor ? fontColor : theme.palette.text.primary,
    borderBottom: noBottomBorder ? "none" : "1px solid rgba(0, 0, 0, 0.12)",
    padding: "0px 32px",
    [theme.breakpoints.down("tablet")]: {
      padding: "0px 16px",
    },
    paddingTop: pt ? pt : 0,
    paddingBottom: pb ? pb : 0,
  };
});

//Inner does the job of containing the content width
const Inner = styled("div", {
  shouldForwardProp: (prop) => prop !== "maxWidth",
})(({ theme, maxWidth }) => ({
  maxWidth: maxWidth ? maxWidth : theme.breakpoints.values.maxContent,
  margin: "0 auto",
}));

function Container(props) {
  const { children, bgImg, bgColor, mt, mb, pt, pb, maxWidth, fontColor, noBottomBorder = true, ...restProps } = props;

  return (
    <Outer
      bgColor={bgColor}
      bgImg={bgImg}
      mt={mt}
      mb={mb}
      pt={pt}
      pb={pb}
      fontColor={fontColor}
      noBottomBorder={noBottomBorder}
      {...restProps}
    >
      <Inner maxWidth={maxWidth}>{children}</Inner>
    </Outer>
  );
}

export default Container;
