import * as Yup from "yup";

import AmazonCognitoIcon from "src/components/Icons/AmazonCognito/AmazonCognito";
import AuthOIcon from "src/components/Icons/AuthO/AuthO";
import GithubLoginIcon from "src/components/Icons/GithubLogin/GithubLogin";
import GoogleLoginIcon from "src/components/Icons/GoogleLogin/GoogleLogin";
import KeycloakIcon from "src/components/Icons/Keycloak/Keycloak";
import MicrosoftEntraIcon from "src/components/Icons/MicrosoftEntra/MicrosoftEntra";
import OklaIcon from "src/components/Icons/Okla/Okla";
import OpenIDConnectIcon from "src/components/Icons/OpenIDConnect/OpenIDConnect";

export const IDENTITY_PROVIDER_STATUS_TYPES = {
  READY: "READY",
  PENDING: "PENDING",
  FAILED: "FAILED",
};

export const IDENTITY_PROVIDER_TYPES = {
  Google: "Google",
  GitHub: "GitHub",
};

export const createSigninValidationSchema = Yup.object({
  email: Yup.string().email("Invalid email address").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

export const IDENTITY_PROVIDER_ICON_MAP = {
  Google: GoogleLoginIcon,
  GitHub: GithubLoginIcon,
  "Amazon Cognito": AmazonCognitoIcon,
  "Microsoft Entra": MicrosoftEntraIcon,
  Okta: OklaIcon,
  Auth0: AuthOIcon,
  Keycloak: OpenIDConnectIcon,
  "OpenID Connect": KeycloakIcon,
};
