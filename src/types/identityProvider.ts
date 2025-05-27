import type { components, paths } from "./schema";

export type RenderIdentityProviderSuccessResponse =
  paths["/2022-09-01-00/identity-provider-render"]["post"]["responses"]["200"]["content"]["application/json"];

export type IdentityProvider = components["schemas"]["RenderedIdentityProviderResult"];