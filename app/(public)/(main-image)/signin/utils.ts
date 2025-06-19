import { IdentityProvider } from "src/types/identityProvider";

export function getIdentityProviderButtonLabel(identityProvider: IdentityProvider) {
  return (
    identityProvider.loginButtonText ||
    `Continue with ${identityProvider.name || identityProvider.identityProviderName}`
  );
}
