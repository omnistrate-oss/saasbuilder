import {
  getCookiePolicyRoute,
  getInstancesRoute,
  getPrivacyPolicyRoute,
  getResetPasswordRoute,
  getSigninRoute,
  getSignupRoute,
  getTermsOfUseRoute,
} from "src/utils/routes";

export const PageURLs = {
  signin: getSigninRoute(),
  signup: getSignupRoute(),
  resetPassword: getResetPasswordRoute(),
  termsOfUse: getTermsOfUseRoute(),
  privacyPolicy: getPrivacyPolicyRoute(),
  cookiePolicy: getCookiePolicyRoute(),

  // Inner Pages
  instances: getInstancesRoute(),
};
