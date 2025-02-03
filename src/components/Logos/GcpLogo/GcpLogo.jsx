import React from "react";
import NextImage from "next/image";
import { styled } from "@mui/material";

import gcpIcon from "public/assets/images/logos/gcp.svg";

const Image = styled(NextImage)(() => ({}));

function GcpLogo(props) {
  return <Image src={gcpIcon} alt="gcp-logo" {...props} />;
}

export default GcpLogo;
