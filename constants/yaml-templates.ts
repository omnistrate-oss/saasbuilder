import { readFileSync } from "fs";

const replaceAccountCredentials = (yaml: string) => {
  const accountId = process.env.AWS_ACCOUNT_ID;
  const gcpProjectId = process.env.GCP_PROJECT_ID;
  const gcpProjectNumber = process.env.GCP_PROJECT_NUMBER;

  if (!accountId || !gcpProjectId || !gcpProjectNumber) {
    throw new Error("Missing required environment variables for account credentials");
  }

  return yaml
    .replace(/{{AWS_ACCOUNT_ID}}/g, accountId)
    .replace(/{{GCP_PROJECT_ID}}/g, gcpProjectId)
    .replace(/{{GCP_PROJECT_NUMBER}}/g, gcpProjectNumber);
};

export const yamlTemplates = {
  postgresProviderHostedDT: btoa(
    replaceAccountCredentials(readFileSync(`${__dirname}/templates/postgres-provider-hosted-dt.yaml`, "utf8"))
  ),
  supabaseBYOAHostedDT: btoa(
    replaceAccountCredentials(readFileSync(`${__dirname}/templates/supabase-byoa-hosted-dt.yaml`, "utf8"))
  ),
  redisHelmProviderHosted: btoa(
    replaceAccountCredentials(readFileSync(`${__dirname}/templates/redis-helm-provider-hosted.yaml`, "utf8"))
  ),
};
