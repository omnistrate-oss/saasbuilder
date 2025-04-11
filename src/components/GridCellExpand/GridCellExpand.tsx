import Box from "@mui/material/Box";
import React from "react";
import CopyToClipboardButton from "../CopyClipboardButton/CopyClipboardButton";
import Link from "next/link";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";

type GridCellExpandProps = {
  width?: any;
  value: string;
  copyButton?: boolean;
  startIcon?: any;
  endIcon?: any;
  textStyles?: any;
  onClick?: () => void;
  href?: string;
  target?: "_self" | "_blank";
  justifyContent?: string;
  externalLinkArrow?: boolean;
  disabled?: boolean;
};

const GridCellExpand = React.memo(function GridCellExpand(
  props: GridCellExpandProps
) {
  const {
    width,
    value,
    copyButton,
    startIcon,
    endIcon,
    textStyles = {},
    onClick = () => {},
    href,
    target = "_self",
    justifyContent = "start",
    externalLinkArrow,
    disabled = false,
  } = props;

  const wrapper = React.useRef(null);
  const cellDiv = React.useRef(null);
  const cellValue = React.useRef(null);

  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  const CellValue = (
    <Box
      sx={{
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
        position: "relative",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "6px",
        color: disabled ? "#A4A7AE" : "inherit", // Apply disabled color
        cursor: disabled ? "not-allowed" : "pointer",
      }}
    >
      {startIcon && (
        <Box component="span" sx={{ display: "flex", alignItems: "center" }}>
          {startIcon}
          {Boolean(copyButton && value) && (
            <CopyToClipboardButton
              text={value}
              buttonStyles={{ marginLeft: "10px" }}
              disabled={disabled}
            />
          )}
        </Box>
      )}

      <Box
        textOverflow="ellipsis"
        overflow="hidden"
        ref={cellValue}
        sx={{
          ...(href && !disabled ? { color: "#6941C6" } : {}),
          ...(disabled ? { color: "#A4A7AE" } : {}),
          ...textStyles,
        }}
        onClick={handleClick}
        title={value}
      >
        {value}
      </Box>

      {endIcon}
      {!endIcon && externalLinkArrow && (
        <ArrowOutwardIcon
          fontSize="small"
          sx={{
            color: disabled ? "#A4A7AE" : "#7F56D9",
          }}
        />
      )}
    </Box>
  );

  return (
    <Box
      ref={wrapper}
      sx={{
        alignItems: "center",
        lineHeight: "24px",
        width: "100%",
        height: "100%",
        position: "relative",
        display: "flex",
        justifyContent: justifyContent,
      }}
    >
      <Box
        ref={cellDiv}
        sx={{
          height: "100%",
          width,
          display: "block",
          position: "absolute",
          top: 0,
        }}
      />

      {href && !disabled ? (
        <Link
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: justifyContent,
            width: "100%",
            color: disabled ? "#A4A7AE" : "inherit",
            pointerEvents: disabled ? "none" : "auto",
          }}
          href={href}
          target={target}
        >
          {CellValue}
        </Link>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: justifyContent,
            width: "100%",
            color: disabled ? "#A4A7AE" : "inherit",
            pointerEvents: disabled ? "none" : "auto",
          }}
        >
          {CellValue}
        </Box>
      )}
    </Box>
  );
});

export default GridCellExpand;
