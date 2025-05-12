"use client";

import { styled, Typography } from "@mui/material";

const variantTypes = {
  desktop: "desktop",
  mobile: "mobile",
};

export const weightTypes = {
  medium: "medium",
  regular: "regular",
  semibold: "semibold",
  bold: "bold",
  extrabold: "extrabold",
};

export const weights = {
  regular: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
  extrabold: 800,
};

const shouldForwardProp = (prop) => {
  return (prop !== prop) !== "variant" && prop !== "weight";
};

export const H3 = styled("h3", {
  shouldForwardProp,
})(({ variant = variantTypes.desktop, weight = weightTypes.bold }) => ({
  fontSize: variant === variantTypes.desktop ? 32 : 28,
  lineHeight: variant === variantTypes.desktop ? 40 : 36,
  fontWeight: weights[weight],
}));

export const H5 = styled("h5", {
  shouldForwardProp,
})(({ variant = variantTypes.desktop, weight = weightTypes.bold }) => ({
  fontSize: variant === variantTypes.desktop ? 24 : 20,
  lineHeight: variant === variantTypes.desktop ? "32px" : "28px",
  fontWeight: weights[weight],
}));

export const H6 = styled("h6", {
  shouldForwardProp,
})(({ variant = variantTypes.desktop, weight = weightTypes.bold }) => ({
  fontSize: variant === variantTypes.desktop ? 20 : 18,
  lineHeight: variant === variantTypes.desktop ? "28px" : "24px",
  fontWeight: weights[weight],
}));

const paragraphSizeTypes = {
  large: "large",
  medium: "medium",
  small: "small",
  xsmall: "xsmall",
};

const paragraphAndTextSizes = {
  large: {
    fontSize: "18px",
    lineHeight: "28px",
  },
  medium: {
    fontSize: "16px",
    lineHeight: "24px",
  },
  small: {
    fontSize: "14px",
    lineHeight: "20px",
  },
  xsmall: {
    fontSize: "12px",
    lineHeight: "18px",
  },
};

const paragraphSizes = {
  ...paragraphAndTextSizes,
};

export const textStyles = {
  ...paragraphAndTextSizes,
};

const paragraphWeightTypes = {
  regular: "regular",
  medium: "medium",
  semibold: "semibold",
};
const paragraphWeights = {
  regular: 400,
  medium: 500,
  semibold: 600,
};

export const P = styled("p", {
  shouldForwardProp: (prop) => prop !== "size" && prop !== "weight",
})(({ size = paragraphSizeTypes.medium, weight = paragraphWeightTypes.medium }) => ({
  ...paragraphSizes[size],
  fontWeight: paragraphWeights[weight],
}));

const displayTextSizeTypes = {
  xsmall: "xsmall",
  small: "small",
  large: "large",
  medium: "medium",
  xlarge: "xlarge",
};

const displayTextSizes = {
  [displayTextSizeTypes.xsmall]: {
    fontSize: 24,
    lineHeight: "32px",
  },
  [displayTextSizeTypes.small]: {
    fontSize: 30,
    lineHeight: "38px",
  },
  [displayTextSizeTypes.medium]: {
    fontSize: 36,
    lineHeight: "44px",
  },
  [displayTextSizeTypes.large]: {
    fontSize: 48,
    lineHeight: "60px",
  },
  [displayTextSizeTypes.xlarge]: {
    fontSize: "60px",
    lineHeight: "72px",
  },
};

export const DisplayText = styled("h2", {
  shouldForwardProp: (prop) => !["size", "weight", "sx", "color", "mt", "mb", "pt", "pb"].includes(prop),
})(({ size = displayTextSizeTypes.small, weight = weightTypes.semibold }) => ({
  ...displayTextSizes[size],
  fontWeight: weights[weight],
}));

export const textSizeTypes = {
  xlarge: "xlarge",
  large: "large",
  medium: "medium",
  small: "small",
  xsmall: "xsmall",
  heading: "heading",
};

const styles = {
  [textSizeTypes.xlarge]: {
    fontSize: "20px",
    lineHeight: "30px",
  },
  [textSizeTypes.large]: {
    fontSize: "18px",
    lineHeight: "28px",
  },
  [textSizeTypes.medium]: {
    fontSize: "16px",
    lineHeight: "24px",
  },
  [textSizeTypes.small]: {
    fontSize: "14px",
    lineHeight: "20px",
  },
  [textSizeTypes.xsmall]: {
    fontSize: "12px",
    lineHeight: "18px",
  },
  [textSizeTypes.heading]: {
    fontSize: "22px",
    lineHeight: "22px",
  },
};

export const Text = ({
  size = "small",
  weight = weightTypes.semibold,
  sx = {},
  color = "#101828",
  mt = 0,
  ml = 0,
  ellipsis = false,
  width = 0, // Default value to avoid Typescript errors
  maxWidth = "auto", // Default value to avoid Typescript errors
  children,
  ...otherProps
}) => {
  let marginTop = "0px";
  if (typeof mt === "number") {
    marginTop = mt * 8;
  }
  if (typeof mt === "string") {
    marginTop = mt;
  }

  let marginLeft = "0px";
  if (typeof ml === "number") {
    marginLeft = ml * 8;
  }
  if (typeof ml === "string") {
    marginLeft = ml;
  }

  let ellipsisObj = {};
  if (ellipsis) {
    ellipsisObj = {
      textOverflow: "ellipsis",
      overflow: "hidden",
    };

    if (width) {
      ellipsisObj.width = width;
      ellipsisObj.whiteSpace = "nowrap";
    }

    if (maxWidth) {
      ellipsisObj.maxWidth = maxWidth;
      ellipsisObj.whiteSpace = "nowrap";
    }
  }

  return (
    <Typography
      component="p"
      sx={{
        ...styles[size],
        fontWeight: weights[weight],
        color: color,
        marginTop: marginTop,
        marginLeft: marginLeft,
        ...ellipsisObj,
        ...sx,
      }}
      {...otherProps}
    >
      {children}
    </Typography>
  );
};
