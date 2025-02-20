import Box from "@mui/material/Box";
import React from "react";
import CopyToClipboardButton from "../CopyClipboardButton/CopyClipboardButton";
import Link from "next/link";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { colors } from "src/themeConfig";

// function isOverflown(element) {
//   return (
//     element.scrollHeight > element.clientHeight ||
//     element.scrollWidth > element.clientWidth
//   );
// }

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
  } = props;
  const wrapper = React.useRef(null);
  const cellDiv = React.useRef(null);
  const cellValue = React.useRef(null);
  // const [anchorEl, setAnchorEl] = React.useState(null);
  // const [showFullCell, setShowFullCell] = React.useState(false);
  // const [showPopper, setShowPopper] = React.useState(false);

  // const handleMouseEnter = () => {
  //   const isCurrentlyOverflown = isOverflown(cellValue.current);
  //   setShowPopper(isCurrentlyOverflown);
  //   setAnchorEl(cellDiv.current);
  //   setShowFullCell(true);
  // };

  // const handleMouseLeave = () => {
  //   setShowFullCell(false);
  // };

  // React.useEffect(() => {
  //   if (!showFullCell) {
  //     return undefined;
  //   }

  //   function handleKeyDown(nativeEvent) {
  //     // IE11, Edge (prior to using Bink?) use 'Esc'
  //     if (nativeEvent.key === "Escape" || nativeEvent.key === "Esc") {
  //       setShowFullCell(false);
  //     }
  //   }

  //   document.addEventListener("keydown", handleKeyDown);

  //   return () => {
  //     document.removeEventListener("keydown", handleKeyDown);
  //   };
  // }, [setShowFullCell, showFullCell]);

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
      }}
    >
      <Box
        component="span"
        sx={{
          "& *": {
            display: "block",
          },
        }}
      >
        {startIcon}
        {Boolean(copyButton && value) && (
          <CopyToClipboardButton
            text={value}
            size="small"
            buttonStyles={{ marginLeft: "10px" }}
          />
        )}
      </Box>
      <Box
        textOverflow="ellipsis"
        overflow="hidden"
        ref={cellValue}
        sx={{ ...(href ? { color: colors.blue600 } : {}), ...textStyles }}
        onClick={onClick}
        title={value}
      >
        {value}
      </Box>
      {endIcon}
      {!endIcon && externalLinkArrow && (
        <ArrowOutwardIcon
          fontSize="small"
          sx={{
            color: colors.blue600,
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
      {href ? (
        <Link
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: justifyContent,
            width: "100%",
          }}
          href={href}
          target={target}
        >
          {CellValue}
        </Link>
      ) : (
        CellValue
      )}

      {/* {showPopper && (
        <Popper
          open={showFullCell && anchorEl !== null}
          anchorEl={anchorEl}
          style={{ width, marginLeft: -17 }}
        >
          <Paper
            elevation={1}
            style={{ minHeight: wrapper.current.offsetHeight - 3 }}
          >
            <Typography
              variant="body2"
              sx={{ padding: "8px", fontSize: "14px" }}
            >
              {value}
            </Typography>
          </Paper>
        </Popper>
      )} */}
    </Box>
  );
});

export default GridCellExpand;

export function renderCellExpand(params) {
  return (
    <GridCellExpand
      value={params.value || ""}
      width={params.colDef.computedWidth}
    />
  );
}
