import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, InputAdornment, Stack, styled } from "@mui/material";
import { FormikProps } from "formik";

import Button from "src/components/Button/Button";
import FieldLabel from "src/components/FormElements/FieldLabel/FieldLabel";
import FieldContainer from "src/components/FormElementsv2/FieldContainer/FieldContainer";
import TextField from "src/components/FormElementsv2/TextField/TextField";
import { Text } from "src/components/Typography/Typography";
import { SetState } from "src/types/common/reactGenerics";
import { IdentityProvider } from "src/types/identityProvider";

import { IDENTITY_PROVIDER_ICON_MAP } from "../constants";
import { useLastLoginDetails } from "../hooks/useLastLoginDetails";

import PasswordLoginFields from "./PasswordLoginFields";

const LogoImg = styled("img")({
  height: "24px",
  width: "24px",
  display: "inline-block",
});

type LoginMethodStepProps = {
  setCurrentStep: SetState<number>;
  formData: FormikProps<{
    email: "";
    password: "";
  }>;
  identityProviders: IdentityProvider[];
  isPasswordLoginEnabled: boolean;
  isPasswordSignInLoading: boolean;
  isRecaptchaScriptLoaded: boolean;
  isReCaptchaSetup: boolean;
};

const LoginMethodStep: FC<LoginMethodStepProps> = (props) => {
  const {
    setCurrentStep,
    formData,
    identityProviders,
    isPasswordLoginEnabled,
    isPasswordSignInLoading,
    isReCaptchaSetup,
    isRecaptchaScriptLoaded,
  } = props;
  const [idpOptionsExpanded, setIdpOptionsExpanded] = useState(false);
  const router = useRouter();
  const { loginMethod: loginMethodStringified } = useLastLoginDetails();
  const userEmail = formData.values.email;
  const emailDomain = userEmail.split("@")[1] || "";
  const [preferredLoginMethodName, setPreferredLoginMethodName] = useState<string | null>(null);
  const [viewType, setViewType] = useState<"password-login" | "login-options">("login-options");

  const domainFilteredIdentityProviders = useMemo(() => {
    return identityProviders.filter((idp) => {
      const emailIdentifiersList = idp.emailIdentifiers.split(",").map((identifier) => identifier.trim());
      return emailIdentifiersList.some((identifier) => {
        return identifier === emailDomain;
      });
    });
  }, [identityProviders, emailDomain]);

  //set default sign in method using data from last login stored in localStorage
  useEffect(() => {
    //'Password' or some IDP type
    let preferredLoginMethod;
    let preferredIdpName;
    let selectedPreferredLoginMethod: string | null = null;

    if (loginMethodStringified) {
      try {
        const loginMethod = JSON.parse(loginMethodStringified);
        const { methodType, idpName } = loginMethod;
        preferredLoginMethod = methodType;
        preferredIdpName = idpName;

        if (preferredLoginMethod && preferredLoginMethod.toLowerCase() === "password") {
          selectedPreferredLoginMethod = "Password";
        } else if (preferredIdpName && !preferredLoginMethod) {
          if (preferredIdpName && preferredIdpName.length > 0) {
            //check if the identity providers list has the preferredIdpName
            const matchingIdp = domainFilteredIdentityProviders.find(
              (idp) => idp.name.toLowerCase() === preferredIdpName.toLowerCase()
            );
            if (matchingIdp) {
              selectedPreferredLoginMethod = matchingIdp.name;
            }
          }
        }
      } catch {}
    } else {
      // Default to first IDP if no preferred login method is found
      if (domainFilteredIdentityProviders.length > 0) {
        selectedPreferredLoginMethod = domainFilteredIdentityProviders[0].name;
      } else {
        if (isPasswordLoginEnabled) {
          selectedPreferredLoginMethod = "Password";
        }
      }
    }
    if (selectedPreferredLoginMethod) {
      setPreferredLoginMethodName(selectedPreferredLoginMethod);
      if (selectedPreferredLoginMethod.toLowerCase() === "password") {
        setViewType("password-login");
      }
    }
  }, [loginMethodStringified, domainFilteredIdentityProviders, isPasswordLoginEnabled]);

  let defaultLoginMethodButton: ReactNode | null = null;

  const passwordLoginButton = (
    <Button
      variant="outlined"
      size="xlarge"
      startIcon={<Box width="24px" height="24px" />}
      sx={{ justifyContent: "flex-start" }}
      onClick={() => {
        setViewType("password-login");
        setIdpOptionsExpanded(false);
      }}
    >
      <Box display="inline-flex" flexGrow={1} justifyContent="center">
        Sign In With Password
      </Box>
    </Button>
  );

  if (preferredLoginMethodName) {
    if (preferredLoginMethodName?.toLocaleLowerCase() === "password") {
      defaultLoginMethodButton = passwordLoginButton;
    } else {
      const matchingIdp = domainFilteredIdentityProviders.find(
        (idp) => idp.name.toLowerCase() === preferredLoginMethodName.toLowerCase()
      );

      if (matchingIdp) {
        const loginButtonIconUrl = matchingIdp.loginButtonIconUrl;

        let LoginButtonIcon: ReactNode;
        if (loginButtonIconUrl) {
          LoginButtonIcon = <LogoImg src={loginButtonIconUrl} alt={matchingIdp.name} />;
        } else if (IDENTITY_PROVIDER_ICON_MAP[matchingIdp.identityProviderName]) {
          const IconComponent: FC = IDENTITY_PROVIDER_ICON_MAP[matchingIdp.identityProviderName];
          LoginButtonIcon = <IconComponent />;
        } else {
          LoginButtonIcon = <Box width="24px" height="24px" />;
        }

        defaultLoginMethodButton = (
          <Button
            variant="outlined"
            size="xlarge"
            startIcon={LoginButtonIcon}
            sx={{ justifyContent: "flex-start" }}
            onClick={() => {
              router.push(matchingIdp.renderedAuthorizationEndpoint);
            }}
          >
            <Box display="inline-flex" flexGrow={1} justifyContent="center">
              {matchingIdp.name}
            </Box>
          </Button>
        );
      }
    }
  }

  return (
    <Stack gap="24px">
      <FieldContainer>
        <FieldLabel>Welcome</FieldLabel>
        {/* @ts-ignore */}
        <TextField
          inputProps={{
            "data-testid": "email-input",
          }}
          name="email"
          id="email"
          placeholder="Enter your registered email"
          value={formData.values.email}
          onChange={formData.handleChange}
          onBlur={formData.handleBlur}
          error={formData.touched.email && formData.errors.email}
          helperText={formData.touched.email && formData.errors.email}
          disabled
          InputProps={{
            endAdornment: (
              <InputAdornment
                position="end"
                sx={{
                  borderLeft: "1px solid #D5D7DA",
                  paddingLeft: "18px !important",
                  paddingRight: "18px !important",
                }}
              >
                <Text
                  size="medium"
                  weight="semibold"
                  style={{
                    color: "#414651",
                    cursor: "pointer",
                    userSelect: "none",
                    textAlign: "center",
                  }}
                  onClick={() => setCurrentStep(0)}
                >
                  Change{" "}
                </Text>
              </InputAdornment>
            ),
          }}
        />
      </FieldContainer>
      {viewType === "password-login" ? (
        <PasswordLoginFields
          formData={formData}
          isReCaptchaSetup={isReCaptchaSetup}
          isRecaptchaScriptLoaded={isRecaptchaScriptLoaded}
          isPasswordSignInLoading={isPasswordSignInLoading}
        />
      ) : (
        <Stack gap="12px">
          {defaultLoginMethodButton}

          {idpOptionsExpanded &&
            domainFilteredIdentityProviders
              .filter((idp) => idp.name !== preferredLoginMethodName)
              .map((idp) => {
                const loginButtonIconUrl = idp.loginButtonIconUrl;

                let LoginButtonIcon: ReactNode;
                if (loginButtonIconUrl) {
                  LoginButtonIcon = <LogoImg src={loginButtonIconUrl} alt={idp.name} />;
                } else if (IDENTITY_PROVIDER_ICON_MAP[idp.identityProviderName]) {
                  const IconComponent: FC = IDENTITY_PROVIDER_ICON_MAP[idp.identityProviderName];
                  LoginButtonIcon = <IconComponent />;
                } else {
                  LoginButtonIcon = <Box width="24px" height="24px" />;
                }

                return (
                  <Button
                    variant="outlined"
                    key={idp.name}
                    size="xlarge"
                    startIcon={LoginButtonIcon}
                    sx={{ justifyContent: "flex-start" }}
                    onClick={() => {
                      router.push(idp.renderedAuthorizationEndpoint);
                    }}
                  >
                    <Box display="inline-flex" flexGrow={1} justifyContent="center">
                      {" "}
                      {idp.name}
                    </Box>
                  </Button>
                );
              })}
          {preferredLoginMethodName?.toLocaleLowerCase() !== "password" &&
            isPasswordLoginEnabled &&
            idpOptionsExpanded &&
            passwordLoginButton}
        </Stack>
      )}

      <Button
        variant="text"
        disableRipple
        endIcon={
          idpOptionsExpanded ? (
            <ExpandLessIcon style={{ color: "#414651", fontSize: "20px" }} />
          ) : (
            <ExpandMoreIcon style={{ color: "#414651", fontSize: "20px" }} />
          )
        }
        onClick={() => {
          if (idpOptionsExpanded) {
            // If the options are expanded, we switch to password login
            if (preferredLoginMethodName?.toLowerCase() === "password") {
              setViewType("password-login");
            } else {
              setViewType("login-options");
            }
          } else {
            setViewType("login-options");
          }

          setIdpOptionsExpanded((prev) => !prev);
        }}
      >
        <Text size="medium" weight="semibold" sx={{ color: "#414651", textAlign: "center" }}>
          {idpOptionsExpanded ? "View less options" : "Other sign in options"}
        </Text>
      </Button>

      <Text size="small" weight="regular" sx={{ color: "#535862", textAlign: "center" }}>
        New to Omnistrate?{" "}
        <Link href="/signup" style={{ color: "#364152", fontWeight: 600 }}>
          Sign Up{" "}
        </Link>
      </Text>
    </Stack>
  );
};

export default LoginMethodStep;
