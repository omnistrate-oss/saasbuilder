import Link from "next/link";
import { useRouter } from "next/router";
import { useMutation } from "@tanstack/react-query";
import { Box, Stack, Typography } from "@mui/material";
import { useFormik } from "formik";
import axios from "src/axios";
import Cookies from "js-cookie";
import * as Yup from "yup";
import MainImageLayout from "components/NonDashboardComponents/Layout/MainImageLayout";
import FieldContainer from "components/NonDashboardComponents/FormElementsV2/FieldContainer";
import FieldLabel from "components/NonDashboardComponents/FormElementsV2/FieldLabel";
import SubmitButton from "components/NonDashboardComponents/FormElementsV2/SubmitButton";
import TextField from "components/NonDashboardComponents/FormElementsV2/TextField";
import PasswordField from "components/NonDashboardComponents/FormElementsV2/PasswordField";
import { customerUserSignin } from "src/api/customer-user";
import useSnackbar from "src/hooks/useSnackbar";
import GoogleLogin from "./components/GoogleLogin";
import { IDENTITY_PROVIDER_STATUS_TYPES } from "./constants";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GithubLogin from "./components/GitHubLogin";
import { useEffect, useRef, useState } from "react";
import useEnvironmentType from "src/hooks/useEnvironmentType";
import { ENVIRONMENT_TYPES } from "src/constants/environmentTypes";
import ReCAPTCHA from "react-google-recaptcha";
import DisplayHeading from "components/NonDashboardComponents/DisplayHeading";
import { Text } from "src/components/Typography/Typography";
import { getMarketplaceProductTierRoute } from "src/utils/route/access/accessRoute";

const createSigninValidationSchema = Yup.object({
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const SigninPage = (props) => {
  const {
    orgName,
    orgLogoURL,
    googleIdentityProvider,
    githubIdentityProvider,
    saasBuilderBaseURL,
    googleReCaptchaSiteKey,
    isReCaptchaSetup,
  } = props;
  const router = useRouter();
  const environmentType = useEnvironmentType();
  const { redirect_reason, destination } = router.query;
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [hasCaptchaErrored, setHasCaptchaErrored] = useState(false);
  const reCaptchaRef = useRef(null);
  const snackbar = useSnackbar();

  useEffect(() => {
    if (redirect_reason === "idp_auth_error") {
      snackbar.showError("Something went wrong. Please retry");

      if (destination)
        router.replace(
          `/signin?destination=${encodeURIComponent(destination)}`
        );
      else router.replace("/signin");
    }
    /*eslint-disable-next-line react-hooks/exhaustive-deps*/
  }, [redirect_reason]);

  function handleSignInSuccess(jwtToken) {
    function isValidDestination(destination) {
      const decodedURL = decodeURIComponent(destination);
      const allowedPaths = ["/service-plans", "service-plans"];
      const isAllowedPath = allowedPaths.some((path) =>
        decodedURL.startsWith(path)
      );

      if (isAllowedPath) {
        const { serviceId } = extractQueryParams(decodedURL);
        if (serviceId) return true;
      }

      return false;
    }

    function extractQueryParams(decodedURL) {
      try {
        if (!decodedURL) return { serviceId: null, environmentId: null };

        const queryString = decodedURL.split("?")[1];
        if (!queryString) return { serviceId: null, environmentId: null };

        const queryParams = new URLSearchParams(queryString);

        const serviceId = queryParams.get("serviceId");
        const environmentId = queryParams.get("environmentId");

        // Sanitize parameters
        const sanitizedServiceId = serviceId?.trim();
        const sanitizedEnvironmentId = environmentId?.trim();

        return {
          serviceId: sanitizedServiceId || null,
          environmentId: sanitizedEnvironmentId || null,
        };
      } catch (error) {
        return { serviceId: null, environmentId: null };
      }
    }
    

    if (jwtToken) {
      Cookies.set("token", jwtToken, { sameSite: "Lax", secure: true });
      axios.defaults.headers["Authorization"] = "Bearer " + jwtToken;

      // Redirect to the Destination URL
      if (destination && isValidDestination(destination)) {
        const decodedDestination = decodeURIComponent(destination);
        const { serviceId, environmentId } =
          extractQueryParams(decodedDestination);

        const route = getMarketplaceProductTierRoute(serviceId, environmentId);
        router.replace(route);
      } else {
        router.replace("/redirect");
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
      onError: (error) => {
        if (error.response.data && error.response.data.message) {
          const errorMessage = error.response.data.message;
          snackbar.showError(errorMessage);
        } else {
          snackbar.showError(
            "Failed to sign in. Either the credentials are incorrect or the user does not exist"
          );
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
    <MainImageLayout
      pageTitle="Sign in"
      orgName={orgName}
      orgLogoURL={orgLogoURL}
    >
      <DisplayHeading mt="24px">Login to your account</DisplayHeading>

      <Stack component="form" gap="32px" mt="44px">
        {/* Signin Form */}
        <Stack gap="30px">
          <FieldContainer>
            <FieldLabel required>Email Address</FieldLabel>
            <TextField
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
            type="submit"
            onClick={formik.handleSubmit}
            disabled={!formik.isValid || (isReCaptchaSetup && !isScriptLoaded)}
            loading={signInMutation.isLoading}
          >
            Login
          </SubmitButton>
          {isReCaptchaSetup && (
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
        <Stack
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt="22px"
        >
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
        <Typography
          mt="22px"
          fontWeight="500"
          fontSize="14px"
          lineHeight="22px"
          color="#A0AEC0"
          textAlign="center"
        >
          You’re new in here?{" "}
          <Link href="/signup" style={{ color: "#27A376" }}>
            Create Account
          </Link>
        </Typography>
      )}
    </MainImageLayout>
  );
};

export default SigninPage;
