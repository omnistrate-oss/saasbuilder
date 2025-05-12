import NextImage from "next/image";
import { styled } from "@mui/material";

import awsIcon from "public/assets/images/logos/aws.svg";

const Image = styled(NextImage)(() => ({}));

function AwsLogo(props) {
  return <Image src={awsIcon} alt="aws-logo" {...props} />;
}

export default AwsLogo;
