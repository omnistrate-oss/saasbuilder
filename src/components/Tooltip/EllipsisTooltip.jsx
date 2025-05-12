import { Box } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";

function EllipsisTooltipText({ text, sx, ...restProps }) {
  const textElementRef = useRef(null);
  const [hasEllipsis, setHasEllipsis] = useState(false);

  const compareSize = () => {
    if (textElementRef.current) {
      const compare = textElementRef.current.scrollWidth > textElementRef.current.clientWidth;
      setHasEllipsis(compare);
    }
  };

  useEffect(() => {
    // compare once and add resize listener on "Mount"
    compareSize();
    window.addEventListener("resize", compareSize);
    // remove resize listener again on "unmount"

    return () => window.removeEventListener("resize", compareSize);
  }, [textElementRef]);

  return (
    <Box
      sx={{
        width: "100%",
        display: "inline-block",
        overflow: "hidden",
        textOverflow: "ellipsis",
        fontSize: "14px",
        lineHeight: "20px",
        weight: 600,
        ...(sx ? sx : {}),
      }}
      {...restProps}
      ref={textElementRef}
      {...(hasEllipsis ? { title: text } : {})}
    >
      {text}
    </Box>
  );
}

export default EllipsisTooltipText;
