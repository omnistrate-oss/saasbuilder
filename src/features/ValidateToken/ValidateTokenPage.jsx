import { useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Stack, Typography } from "@mui/material";
import styled from "@emotion/styled";
import useSnackbar from "src/hooks/useSnackbar";
import axios from "src/axios";
import CenterContentLayout from "components/NonDashboardComponents/Layout/CenterContentLayout";
import PageHeading from "components/NonDashboardComponents/PageHeading";
import ValidateTokenImg from "public/assets/images/non-dashboard/validate-token-main.svg";

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
  const router = useRouter();
  const snackbar = useSnackbar();
  const { email, token } = router.query;

  useEffect(() => {
    if (router.isReady && email && token) {
      axios
        .post("/validate-token", {
          email: decodeURIComponent(email),
          token: decodeURIComponent(token),
        })
        .then(() => {
          snackbar.showSuccess("Validation Successful");
          router.push("/signin");
        })
        .catch(() => {
          router.push("/signup");
        });
    }
    /*eslint-disable-next-line react-hooks/exhaustive-deps*/
  }, [router]);

  return (
    <CenterContentLayout pageTitle="Validate Token">
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
    </CenterContentLayout>
  );
};

export default ValidateTokenPage;
