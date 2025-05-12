import React from "react";
import { Typography } from "@mui/material";

const PageDescription = ({ children }) => {
  return (
    <Typography fontSize="18px" lineHeight="27px" textAlign="center" color="#111827">
      {children}
    </Typography>
  );
};

export default PageDescription;
