import NextImage from "next/image";
import { styled } from "@mui/material";

import gcpIcon from "public/assets/images/logos/gcp.svg";

const Image = styled(NextImage)(() => ({}));

function GcpLogo(props) {
  return <Image src={gcpIcon} alt="gcp-logo" style={{ width: "auto", height: "17px" }} {...props} />;
}

export default GcpLogo;
