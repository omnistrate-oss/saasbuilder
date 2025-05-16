"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { Box, Stack, Typography } from "@mui/material";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import Cookies from "js-cookie";
import ReCAPTCHA from "react-google-recaptcha";
import * as Yup from "yup";

import { customerUserSignin } from "src/api/customer-user";
import axios from "src/axios";
import Logo from "src/components/NonDashboardComponents/Logo";
import { ENVIRONMENT_TYPES } from "src/constants/environmentTypes";
import { PAGE_TITLE_MAP } from "src/constants/pageTitleMap";
import useEnvironmentType from "src/hooks/useEnvironmentType";
import useSnackbar from "src/hooks/useSnackbar";
import { useProviderOrgDetails } from "src/providers/ProviderOrgDetailsProvider";
import { domainsMatch } from "src/utils/compareEmailAndUrlDomains";
import { getInstancesRoute } from "src/utils/routes";
import DisplayHeading from "components/NonDashboardComponents/DisplayHeading";
import FieldContainer from "components/NonDashboardComponents/FormElementsV2/FieldContainer";
import FieldLabel from "components/NonDashboardComponents/FormElementsV2/FieldLabel";
import PasswordField from "components/NonDashboardComponents/FormElementsV2/PasswordField";
import SubmitButton from "components/NonDashboardComponents/FormElementsV2/SubmitButton";
import TextField from "components/NonDashboardComponents/FormElementsV2/TextField";
import { Text } from "components/Typography/Typography";

import { IDENTITY_PROVIDER_STATUS_TYPES } from "../constants";

import AccessDeniedAlertDialog from "./AccessDeniedAlertDialog";
import GithubLogin from "./GitHubLogin";
import GoogleLogin from "./GoogleLogin";
import { domainsMatch } from "src/constants/compareEmailAndUrlDomains";
import AccessDeniedAlertDialog from "./AccessDeniedAlertDialog";

const createSigninValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const SigninPage = (props) => {
  const {
    googleIdentityProvider,
    githubIdentityProvider,
    saasBuilderBaseURL,
    googleReCaptchaSiteKey,
    isReCaptchaSetup,
  } = props;
  const router = useRouter();
  const searchParams = useSearchParams();
  const environmentType = useEnvironmentType();
  const { orgName, orgLogoURL, orgURL } = useProviderOrgDetails();
  const redirect_reason = searchParams?.get("redirect_reason");
  const destination = searchParams?.get("destination");

  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [hasCaptchaErrored, setHasCaptchaErrored] = useState(false);
  const reCaptchaRef = useRef<any>(null);
  const snackbar = useSnackbar();

  const [showAccessDenied, setShowAccessDenied] = useState(false);

  useEffect(() => {
    if (redirect_reason === "idp_auth_error") {
      snackbar.showError("Something went wrong. Please retry");

      if (destination) router.replace(`/signin?destination=${encodeURIComponent(destination)}`);
      else router.replace("/signin");
    }
    /*eslint-disable-next-line react-hooks/exhaustive-deps*/
  }, [redirect_reason]);

  function handleSignInSuccess(jwtToken) {
    function isValidDestination(destination) {
      const decodedURL = decodeURIComponent(destination);
      const isAllowedPath = Boolean(PAGE_TITLE_MAP[decodedURL]);
      return isAllowedPath;
    }

    if (jwtToken) {
      Cookies.set("token", jwtToken, { sameSite: "Lax", secure: true });

      try {
        localStorage.removeItem("loggedInUsingSSO");
      } catch (error) {
        console.warn("Failed to set SSO state:", error);
      }

      axios.defaults.headers["Authorization"] = "Bearer " + jwtToken;

      // Redirect to the Destination URL
      if (destination && isValidDestination(destination)) {
        const decodedDestination = decodeURIComponent(destination);
        router.replace(decodedDestination, {}, { showProgressBar: true });
      } else {
        router.replace(getInstancesRoute(), {}, { showProgressBar: true });
      }
    }
  }

  const signInMutation = useMutation(
    (payload) => {
      delete axios.defaults.headers["Authorization"];
      return customerUserSignin(payload);
    },
    {
      onSuccess: (data) => {
        /*eslint-disable-next-line no-use-before-define*/
        formik.resetForm();
        const jwtToken = data.data.jwtToken;
        handleSignInSuccess(jwtToken);
      },
      onError: (error: any) => {
        if (error.response.data && error.response.data.message) {
          const errorMessage = error.response.data.message;
          if (
            errorMessage === "Failed to sign in. Either the credentials are incorrect or the user does not exist" &&
            environmentType === ENVIRONMENT_TYPES.PROD &&
            domainsMatch(formik.values.email, orgURL)
          ) {
            setShowAccessDenied(true);
          } else {
            snackbar.showError(errorMessage);
          }
        } else {
          snackbar.showError("Failed to sign in. Either the credentials are incorrect or the user does not exist");
        }
      },
    }
  );

  async function handleFormSubmit(values) {
    const data = { ...values };

    if (reCaptchaRef.current && !hasCaptchaErrored) {
      const token = await reCaptchaRef.current.executeAsync();
      reCaptchaRef.current.reset();
      data["reCaptchaToken"] = token;
    }

    signInMutation.mutate(data);
  }

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    enableReinitialize: true,
    onSubmit: handleFormSubmit,
    validationSchema: createSigninValidationSchema,
  });

  const { values, touched, errors, handleChange, handleBlur } = formik;

  let googleIDPClientID = null;
  let showGoogleLoginButton = false;
  let isGoogleLoginDisabled = false;

  if (googleIdentityProvider) {
    showGoogleLoginButton = true;
    googleIDPClientID = googleIdentityProvider.clientId;

    const { status } = googleIdentityProvider;

    if (status === IDENTITY_PROVIDER_STATUS_TYPES.FAILED) {
      isGoogleLoginDisabled = true;
    }
  }

  let githubIDPClientID = null;
  let showGithubLoginButton = false;
  let isGithubLoginDisabled = false;

  if (githubIdentityProvider) {
    showGithubLoginButton = true;
    githubIDPClientID = githubIdentityProvider.clientId;
    const { status } = githubIdentityProvider;

    if (status === IDENTITY_PROVIDER_STATUS_TYPES.FAILED) {
      isGithubLoginDisabled = true;
    }
  }

  const shouldHideSignupLink = environmentType !== ENVIRONMENT_TYPES.PROD;

  return (
    <>
      <Box textAlign="center">
        {orgLogoURL ? (
          <Logo src={orgLogoURL} alt={orgName} style={{ width: "120px", height: "auto", maxHeight: "unset" }} />
        ) : (
          ""
        )}
      </Box>
      <DisplayHeading mt="24px">Login to your account</DisplayHeading>

      <Stack component="form" gap="32px" mt="44px">
        {/* Signin Form */}
        <Stack gap="30px">
          <FieldContainer>
            <FieldLabel required>Email Address</FieldLabel>
            {/* @ts-ignore */}
            <TextField
              inputProps={{
                "data-testid": "email-input",
              }}
              name="email"
              id="email"
              placeholder="Enter your registered email"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.email && errors.email}
              helperText={touched.email && errors.email}
            />
          </FieldContainer>

          <FieldContainer>
            <FieldLabel required>Password</FieldLabel>
            <PasswordField
              inputProps={{
                "data-testid": "password-input",
              }}
              name="password"
              id="password"
              placeholder="Enter your password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.password && errors.password}
              helperText={touched.password && errors.password}
            />
          </FieldContainer>
          {!shouldHideSignupLink && (
            <Link
              href="/reset-password"
              style={{
                fontWeight: "500",
                fontSize: "14px",
                lineHeight: "22px",
                color: "#687588",
              }}
            >
              Forgot Password
            </Link>
          )}
        </Stack>

        {/* Login and Google Button */}
        <Stack gap="16px">
          <SubmitButton
            data-testid="login-button"
            type="submit"
            onClick={formik.handleSubmit}
            disabled={!formik.isValid || (isReCaptchaSetup && !isScriptLoaded)}
            loading={signInMutation.isLoading}
          >
            Login
          </SubmitButton>
          {isReCaptchaSetup && (
            // @ts-ignore
            <ReCAPTCHA
              size="invisible"
              sitekey={googleReCaptchaSiteKey}
              ref={reCaptchaRef}
              asyncScriptOnLoad={() => {
                setIsScriptLoaded(true);
              }}
              onErrored={() => {
                setHasCaptchaErrored(true);
              }}
            />
          )}
        </Stack>
      </Stack>
      {shouldHideSignupLink && (
        <Stack display="flex" justifyContent="center" alignItems="center" mt="22px">
          <Text>Log in with your Omnistrate account credentials</Text>
        </Stack>
      )}

      {Boolean(googleIdentityProvider || githubIdentityProvider) && (
        <>
          <Box borderTop="1px solid #F1F2F4" textAlign="center" mt="40px">
            <Box
              display="inline-block"
              paddingLeft="16px"
              paddingRight="16px"
              color="#687588"
              bgcolor="white"
              fontSize="14px"
              fontWeight="500"
              lineHeight="22px"
              sx={{ transform: "translateY(-50%)" }}
            >
              Or login with
            </Box>
          </Box>
          <Stack direction="row" justifyContent="center" mt="20px" gap="16px">
            {showGoogleLoginButton && (
              <GoogleOAuthProvider
                // @ts-ignore
                clientId={googleIDPClientID}
                onScriptLoadError={() => {}}
                onScriptLoadSuccess={() => {}}
              >
                <GoogleLogin
                  disabled={isGoogleLoginDisabled}
                  saasBuilderBaseURL={saasBuilderBaseURL}
                  destination={destination}
                />
              </GoogleOAuthProvider>
            )}
            {showGithubLoginButton && (
              <GithubLogin
                githubClientID={githubIDPClientID}
                disabled={isGithubLoginDisabled}
                saasBuilderBaseURL={saasBuilderBaseURL}
                destination={destination}
              />
            )}
          </Stack>
        </>
      )}
      {!shouldHideSignupLink && (
        <Typography mt="22px" fontWeight="500" fontSize="14px" lineHeight="22px" color="#A0AEC0" textAlign="center">
          You&apos;re new in here?{" "}
          <Link href="/signup" style={{ color: "#27A376" }}>
            Create Account
          </Link>
        </Typography>
      )}

      <AccessDeniedAlertDialog open={showAccessDenied} handleClose={() => setShowAccessDenied(false)} />
    </>
  );
};

export default SigninPage;
