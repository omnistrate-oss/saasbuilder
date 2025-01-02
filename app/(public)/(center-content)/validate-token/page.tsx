"use client";

import Image from "next/image";
import { Stack, styled, Typography } from "@mui/material";

import PageHeading from "src/components/NonDashboardComponents/PageHeading";
import ValidateTokenImg from "public/assets/images/non-dashboard/validate-token-main.svg";
import { useSearchParams } from "next/navigation";

const StyledImage = styled(Image)({
  "@keyframes pulse": {
    from: {
      transform: "scale(0.9)",
    },
    to: {
      transform: "scale(1.1)",
    },
  },
  animation: `pulse 1s infinite ease-in-out alternate`,
  alignSelf: "center",
});

const ValidateTokenPage = () => {
  const searchParams = useSearchParams();
  const email = searchParams?.get("email");
  const token = searchParams?.get("token");

  return (
    <>
      <StyledImage
        src={ValidateTokenImg}
        alt="Validate Token"
        width={300}
        height={300}
      />
      <Stack gap="16px">
        <PageHeading>Just a moment!..</PageHeading>
        <Typography
          fontWeight="700"
          fontSize="25px"
          lineHeight="34px"
          color="#111827"
          textAlign="center"
        >
          {email && token
            ? "We're in the process of verifying your credentials..."
            : "Missing account activation details. Please check your email and click the confirmation link to retry"}
        </Typography>
      </Stack>
    </>
  );
};

export default ValidateTokenPage;
