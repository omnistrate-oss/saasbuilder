import { FC, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next-nprogress-bar";
import { Stack } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import Cookies from "js-cookie";

import { customerUserSignin } from "src/api/customer-user";
import axios from "src/axios";
import { ENVIRONMENT_TYPES } from "src/constants/environmentTypes";
import { PAGE_TITLE_MAP } from "src/constants/pageTitleMap";
import useEnvironmentType from "src/hooks/useEnvironmentType";
import useSnackbar from "src/hooks/useSnackbar";
import { useProviderOrgDetails } from "src/providers/ProviderOrgDetailsProvider";
import { domainsMatch } from "src/utils/compareEmailAndUrlDomains";
import { getInstancesRoute } from "src/utils/routes";

import { createSigninValidationSchema } from "../constants";

import EmailStep from "./EmailStep";
import IdentityProviders from "./IdentityProviders";
import { useLastLoginDetails } from "../hooks/useLastLoginDetails";
import LoginMethodStep from "./LoginMethodStep";
import { IdentityProvider } from "src/types/identityProvider";

type SignInFormProps = {
  isPasswordLoginEnabled: boolean;
  identityProviders: IdentityProvider[];
};

const SignInForm: FC<SignInFormProps> = ({ identityProviders, isPasswordLoginEnabled }) => {
  const [shouldRememberLoginDetails, setShouldRememberLoginDetails] = useState(true);
  const [hasCaptchaErrored, setHasCaptchaErrored] = useState(false);
  const [showAccessDenied, setShowAccessDenied] = useState(false);
  const { email } = useLastLoginDetails();
  const [currentStep, setCurrentStep] = useState(email ? 1 : 0);

  const environmentType = useEnvironmentType();
  const { orgName, orgLogoURL, orgURL } = useProviderOrgDetails();

  const router = useRouter();

  const searchParams = useSearchParams();
  const redirect_reason = searchParams?.get("redirect_reason");
  const destination = searchParams?.get("destination");
  const snackbar = useSnackbar();

  const reCaptchaRef = useRef<any>(null);

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
      email: email || "",
      password: "",
    },
    enableReinitialize: true,
    onSubmit: handleFormSubmit,
    validationSchema: createSigninValidationSchema,
  });

  return (
    <Stack component="form" gap="32px" mt="44px">
      {currentStep === 0 && (
        <EmailStep
          formData={formik}
          setCurrentStep={setCurrentStep}
          setShouldRememberLoginDetails={setShouldRememberLoginDetails}
          shouldRememberLoginDetails={shouldRememberLoginDetails}
        />
      )}
      {currentStep === 1 && (
        <LoginMethodStep
          formData={formik}
          setCurrentStep={setCurrentStep}
          identityProviders={identityProviders}
          isPasswordLoginEnabled={isPasswordLoginEnabled}
          // hasCaptchaErrored={hasCaptchaErrored}
          // setHasCaptchaErrored={setHasCaptchaErrored}
          // reCaptchaRef={reCaptchaRef}
          // showAccessDenied={showAccessDenied}
          // setShowAccessDenied={setShowAccessDenied}
        />
      )}

      {/* {currentStep === 1 && !errors.email && values?.email && (
        <IdentityProviders
          isPasswordLoginDisabled={isPasswordLoginDisabled}
          identityProvidersList={identityProvidersList?.identityProviders}
        />
      )} */}
    </Stack>
  );
};

export default SignInForm;
