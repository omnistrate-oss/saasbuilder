import { yamlTemplates } from "constants/yaml-templates";
import { GlobalStateManager } from "test-utils/global-state-manager";
import { ProviderAPIClient } from "test-utils/provider-api-client";

async function globalSetup() {
  console.log("Running Global Setup...");

  const apiClient = new ProviderAPIClient();
  let token = GlobalStateManager.getToken("provider");

  if (!token) {
    const email = process.env.PROVIDER_EMAIL;
    const password = process.env.PROVIDER_PASSWORD;

    if (!email || !password) {
      throw new Error("Missing provider credentials in environment variables");
    }

    token = await apiClient.providerLogin(email, password);
    GlobalStateManager.setState({ providerToken: token });
  }

  console.log("Provider Auth Successful");
  const date = `${Date.now()}`;

  await Promise.all([
    apiClient.createServiceFromComposeSpec(
      `SaaSBuilder Postgres DT - ${date}`,
      "SaaSBuilder Postgres DT Service + Provider Hosted",
      yamlTemplates.postgresProviderHostedDT
    ),
    apiClient.createServiceFromComposeSpec(
      `SaaSBuilder Supabase DT BYOA - ${date}`,
      "SaaSBuilder Supabase DT Service + BYOA Hosted",
      yamlTemplates.supabaseBYOAHostedDT
    ),
    apiClient.createServiceFromServicePlanSpec(
      `SaaSBuilder Redis Helm - ${date}`,
      "SaaSBuilder Redis Helm Service + Provider Hosted",
      yamlTemplates.redisHelmProviderHosted
    ),
  ]);

  // Used when Deleting Services
  GlobalStateManager.setState({ date });
  console.log("Global Setup Successful");
}

export default globalSetup;
