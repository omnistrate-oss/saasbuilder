import { yamlTemplates } from "constants/yaml-templates";
import { GlobalStateManager } from "test-utils/global-state-manager";
import { ProviderAPIClient } from "test-utils/provider-api-client";
import { UserAPIClient } from "test-utils/user-api-client";

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

  const userEmail = process.env.USER_EMAIL;
  const userPassword = process.env.USER_PASSWORD;
  if (!userEmail || !userPassword) {
    throw new Error("Missing user credentials in environment variables");
  }

  const userClient = new UserAPIClient();
  await userClient.userLogin(userEmail!, userPassword!);

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
