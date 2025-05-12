import "swagger-ui-react/swagger-ui.css";

import { Box } from "@mui/material";
import React from "react";
import SwaggerUI from "swagger-ui-react";

export default function SwaggerDocs(props) {
  const { data } = props;

  return (
    <Box sx={{ marginTop: "17px" }}>
      <SwaggerUI spec={data} />
    </Box>
  );
}
