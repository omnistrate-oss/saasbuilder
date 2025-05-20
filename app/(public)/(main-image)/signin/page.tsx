import { Metadata } from "next";
import { IDENTITY_PROVIDER_TYPES } from "app/(public)/(main-image)/signin/constants";

import {
  getIdentityProvidersList,
  // , getRenderIdentityProvidersList
} from "src/server/api/identity-provider";
import { checkReCaptchaSetup } from "src/server/utils/checkReCaptchaSetup";
//import { getEnvironmentType } from "src/server/utils/getEnvironmentType";
import { getSaaSDomainURL } from "src/server/utils/getSaaSDomainURL";

import SigninPage from "./components/SigninPage";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

const Page = async () => {
  let googleIdentityProvider = null;
  let githubIdentityProvider = null;

  // const renderResponse = await getRenderIdentityProvidersList({
  //   environmentType: getEnvironmentType(),
  //   redirectUrl: getSaaSDomainURL(),
  // });

  //console.log("renderResponse", renderResponse);

  const response = await getIdentityProvidersList();
  const providers = response.data.identityProviders || [];
  const googleIDP = providers.find((provider) => provider.identityProviderName === IDENTITY_PROVIDER_TYPES.Google);
  if (googleIDP) {
    googleIdentityProvider = googleIDP;
  }

  const githubIDP = providers.find((provider) => provider.identityProviderName === IDENTITY_PROVIDER_TYPES.GitHub);
  if (githubIDP) {
    githubIdentityProvider = githubIDP;
  }

  return (
    <SigninPage
      googleIdentityProvider={googleIdentityProvider}
      githubIdentityProvider={githubIdentityProvider}
      isReCaptchaSetup={checkReCaptchaSetup()}
      saasBuilderBaseURL={getSaaSDomainURL()}
      googleReCaptchaSiteKey={process.env.GOOGLE_RECAPTCHA_SITE_KEY || null}
    />
  );
};

export default Page;
