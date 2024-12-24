import { Box, Typography } from "@mui/material";
import Image from "next/image";

import NoServicesImage from "public/assets/images/marketplace/no-service-offerings.svg";

const NoServiceFoundUI = ({ text }) => {
  return (
    <Box mt="80px" textAlign="center">
      <Typography
        fontWeight="800"
        fontSize="36px"
        lineHeight="44px"
        letterSpacing="-0.02em"
        textAlign="center"
        color="#171717"
        mb="30px"
      >
        {text}
      </Typography>

      <Image src={NoServicesImage} alt="No services" width={582} height={400} />
    </Box>
  );
};

export default NoServiceFoundUI;
