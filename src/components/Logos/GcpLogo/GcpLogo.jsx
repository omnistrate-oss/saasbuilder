import React from "react";
import NextImage from "next/image";
import { styled } from "@mui/material";

import gcpIcon from "public/assets/images/logos/gcp.svg";

function GcpLogo(props) {
  return <Image src={gcpIcon} alt="gcp-logo" {...props} />;
}

export default GcpLogo;

const Image = styled(NextImage)(() => ({}));
