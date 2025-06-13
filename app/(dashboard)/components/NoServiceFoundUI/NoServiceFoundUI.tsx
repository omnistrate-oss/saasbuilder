import { FC } from "react";
import Image from "next/image";
import { Box, Typography } from "@mui/material";

import NoServicesImage from "public/assets/images/marketplace/no-service-offerings.svg";

type NoServiceFoundUIProps = {
  text: string;
};

const NoServiceFoundUI: FC<NoServiceFoundUIProps> = ({ text }) => {
  return (
    <Box
      textAlign="center"
      flex="1"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      sx={{ transform: "translateY(-50px)" }}
    >
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

      <Image src={NoServicesImage} alt="No SaaS Products" width={582} height={400} />
    </Box>
  );
};

export default NoServiceFoundUI;
