"use client";

import { Box, Stack, Typography } from "@mui/material";
import AmazonCognitoIcon from "src/components/Icons/AmazonCognito/AmazonCognito";
import AuthOIcon from "src/components/Icons/AuthO/AuthO";
import GithubLoginIcon from "src/components/Icons/GithubLogin/GithubLogin";
import GoogleLoginIcon from "src/components/Icons/GoogleLogin/GoogleLogin";
import KeycloakIcon from "src/components/Icons/Keycloak/Keycloak";
import MicrosoftEntraIcon from "src/components/Icons/MicrosoftEntra/MicrosoftEntra";
import OklaIcon from "src/components/Icons/Okla/Okla";
import OpenIDConnectIcon from "src/components/Icons/OpenIDConnect/OpenIDConnect";
import SSOLoginButton from "./SSOLoginButton";

const identityProviderIcon = {
  Google: <GoogleLoginIcon width={24} height={24} />,
  Github: <GithubLoginIcon width={24} height={24} />,
  AmazonCognito: <AmazonCognitoIcon />,
  MicrosoftEntra: <MicrosoftEntraIcon />,
  Okla: <OklaIcon />,
  AuthO: <AuthOIcon />,
  OpenIDConnect: <OpenIDConnectIcon />,
  Keycloak: <KeycloakIcon />,
};

const IdentityProviders = ({ isPasswordLoginDisabled = false, identityProvidersList }) => {
  return (
    <Stack direction="column" justifyContent="center" mt="20px" gap="16px">
      {identityProvidersList.map((identityProvider, index) => (
        <SSOLoginButton
          sx={{
            width: "100%",
            padding: "10px 16px !important",
            boxShadow: `
      0px 1px 2px 0px #0A0D120D,
      0px -2px 0px 0px #0A0D120D inset,
      0px 0px 0px 1px #0A0D122E inset
    `,
            borderRadius: "8px",
            height: "44px",
          }}
        >
          {identityProvider?.loginButtonIconUrl ? (
            <img
              src={identityProvider.loginButtonIconUrl}
              alt={identityProvider.identityProviderName}
              style={{ height: 24, marginRight: 8 }}
            />
          ) : (
            identityProviderIcon[identityProvider.identityProviderName]
          )}
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "center",
              flexGrow: 1,
            }}
          >
            <Typography fontWeight="600" fontSize="16px" lineHeight="24px" color="#414651" textAlign="center">
              {identityProvider.loginButtonText ? identityProvider.loginButtonText : identityProvider?.name}
            </Typography>
          </Box>
        </SSOLoginButton>
      ))}
      {!isPasswordLoginDisabled && (
        <SSOLoginButton
          sx={{
            width: "100%",
            padding: "10px 16px !important",
            boxShadow: `
      0px 1px 2px 0px #0A0D120D,
      0px -2px 0px 0px #0A0D120D inset,
      0px 0px 0px 1px #0A0D122E inset
    `,
            borderRadius: "8px",
            height: "44px",
          }}
        >
          <Typography fontWeight="600" fontSize="16px" lineHeight="24px" color="#414651" textAlign="center">
            {"Sign in with Password"}
          </Typography>
        </SSOLoginButton>
      )}
    </Stack>
  );
};

export default IdentityProviders;
