import SigninPage from "src/features/Signin/SigninPage";
import { IDENTITY_PROVIDER_TYPES } from "src/features/Signin/constants";
import { getIdentityProvidersList } from "src/server/api/identity-provider";
import { getSaaSDomainURL } from "src/server/utils/getSaaSDomainURL";
import { checkReCaptchaSetup } from "src/server/utils/checkReCaptchaSetup";

export const getServerSideProps = async () => {
  let googleIdentityProvider = null;
  let githubIdentityProvider = null;

  try {
    const promises = [];

    const identityProvidersPromise = getIdentityProvidersList().then(
      (response) => {
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
      }
    );
    promises.push(identityProvidersPromise);
    await Promise.all(promises);
  } catch (err) {}

  return {
    props: {
      googleIdentityProvider: googleIdentityProvider,
      githubIdentityProvider: githubIdentityProvider,
      saasBuilderBaseURL: getSaaSDomainURL(),
      googleReCaptchaSiteKey: process.env.GOOGLE_RECAPTCHA_SITE_KEY || null,
      isReCaptchaSetup: checkReCaptchaSetup(),
    },
  };
};

export default SigninPage;
