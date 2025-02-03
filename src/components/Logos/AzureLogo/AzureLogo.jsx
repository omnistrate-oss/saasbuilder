import React from "react";
import NextImage from "next/image";
import azureIcon from "../../../../public/assets/images/logos/azure.svg";
import { styled } from "@mui/material";

const Image = styled(NextImage)(() => ({}));

function AzureLogo(props) {
  return <Image src={azureIcon} alt="azure-logo" {...props} />;
}

export default AzureLogo;
