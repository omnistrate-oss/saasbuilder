import { Metadata } from "next";

import SignupPage from "./components/SignupPage";
import { IDENTITY_PROVIDER_TYPES } from "../signin/constants";

import { getSaaSDomainURL } from "src/server/utils/getSaaSDomainURL";
import { checkReCaptchaSetup } from "src/server/utils/checkReCaptchaSetup";
import { getIdentityProvidersList } from "src/server/api/identity-provider";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Sign up for an account",
};

const Page = async () => {
  let googleIdentityProvider = null;
  let githubIdentityProvider = null;

  const response = await getIdentityProvidersList();
  const providers = response.data.identityProviders || [];
  const googleIDP = providers.find(
    (provider) =>
      provider.identityProviderName === IDENTITY_PROVIDER_TYPES.Google
  );
  if (googleIDP) {
    googleIdentityProvider = googleIDP;
  }

  const githubIDP = providers.find(
    (provider) =>
      provider.identityProviderName === IDENTITY_PROVIDER_TYPES.GitHub
  );
  if (githubIDP) {
    githubIdentityProvider = githubIDP;
  }

  return (
    <SignupPage
      googleIdentityProvider={googleIdentityProvider}
      githubIdentityProvider={githubIdentityProvider}
      reCaptchaSetup={checkReCaptchaSetup()}
      saasBuilderBaseURL={getSaaSDomainURL()}
      googleReCaptchaSiteKey={process.env.GOOGLE_RECAPTCHA_SITE_KEY || null}
    />
  );
};

export default Page;
