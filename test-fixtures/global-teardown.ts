import { ResourceInstance } from "src/types/resourceInstance";
import { ServiceOffering } from "src/types/serviceOffering";
import { GlobalStateManager } from "test-utils/global-state-manager";
import { ProviderAPIClient } from "test-utils/provider-api-client";
import { UserAPIClient } from "test-utils/user-api-client";

const deleteInstances = async (instances: ResourceInstance[], serviceOfferings: ServiceOffering[]) => {
  const userAPIClient = new UserAPIClient();

  for (const instance of instances) {
    try {
      const subscription = await userAPIClient.describeSubscription(instance.subscriptionId);
      const serviceOffering = serviceOfferings.find(
        (offering) =>
          offering.serviceId === subscription.serviceId && offering.productTierID === subscription.productTierId
      );
      const param: any = serviceOffering?.resourceParameters.find((param) => param.resourceId === instance.resourceID);

      if (!serviceOffering) {
        console.error(`Service Offering not found for Instance: ${instance.id}`);
        continue;
      }

      if (!instance.id || !instance.subscriptionId) {
        console.error(`Instance is missing required ID or subscription ID`);
        continue;
      }

      const resourceInstance = await userAPIClient.describeResourceInstance(
        serviceOffering.serviceProviderId,
        serviceOffering.serviceURLKey,
        serviceOffering.serviceAPIVersion,
        serviceOffering.serviceEnvironmentURLKey,
        serviceOffering.serviceModelURLKey,
        serviceOffering.productTierURLKey,
        instance.resourceID?.startsWith("r-injected") ? "omnistrateCloudAccountConfig" : param.urlKey,
        instance.id,
        instance.subscriptionId
      );

      if (resourceInstance.status === "DELETING") {
        console.log(`Instance ${instance.id} is already being deleted.`);
        continue;
      }

      await userAPIClient.deleteResourceInstance(
        serviceOffering.serviceProviderId,
        serviceOffering.serviceURLKey,
        serviceOffering.serviceAPIVersion,
        serviceOffering.serviceEnvironmentURLKey,
        serviceOffering.serviceModelURLKey,
        serviceOffering.productTierURLKey,
        instance.resourceID?.startsWith("r-injected") ? "omnistrateCloudAccountConfig" : param.urlKey,
        instance.id,
        instance.subscriptionId
      );

      console.log("Deleting Resource Instance: ", resourceInstance);
    } catch (error) {
      console.error(`Failed to delete instance ${instance.id}:`, error);
    }
  }
};

const waitForDeletion = async (instanceType: "instance" | "cloudAccount") => {
  const userAPIClient = new UserAPIClient(),
    startTime = Date.now(),
    timeout = 10 * 60 * 1000; // 10 minutes

  while (Date.now() - startTime < timeout) {
    const instances = await userAPIClient.listResourceInstances();
    const deletingInstances = instances.filter((instance) => instance.status === "DELETING");

    if (deletingInstances.length === 0) {
      console.log(`All ${instanceType === "instance" ? "Instances" : "Cloud Accounts"} deleted successfully`);
      return;
    }

    console.log(`Waiting for ${deletingInstances.length} instances to be deleted...`);
    await new Promise((resolve) => setTimeout(resolve, 20000)); // Wait for 20 seconds
  }

  console.error("Timeout: Some instances are still being deleted after 10 minutes");
};

async function globalTeardown() {
  console.log("Running Global Teardown...");

  const userAPIClient = new UserAPIClient();

  await userAPIClient.userLogin(process.env.USER_EMAIL!, process.env.USER_PASSWORD!);
  const instances = await userAPIClient.listResourceInstances();
  const serviceOfferings = await userAPIClient.listServiceOffering();

  // Delete Instances
  await deleteInstances(
    instances.filter((el) => !el.resourceID?.startsWith("r-injected")),
    serviceOfferings
  );
  await waitForDeletion("instance");

  // Delete Cloud Accounts
  await deleteInstances(
    instances.filter((el) => el.resourceID?.startsWith("r-injected")),
    serviceOfferings
  );
  await waitForDeletion("cloudAccount");

  // Delete Created Services and Services Older than 2 Days
  const providerAPIClient = new ProviderAPIClient();
  const services = await providerAPIClient.listSaaSBuilderServices();
  const twoDaysAgo = Date.now() - 2 * 24 * 60 * 60 * 1000;
  const date = GlobalStateManager.getDate();

  const servicesToDelete = services.filter((service) => {
    const createdAt = new Date(service.createdAt).getTime();
    if (date) {
      return createdAt < twoDaysAgo || service.name.includes(date);
    }
    return createdAt < twoDaysAgo;
  });

  for (const service of servicesToDelete) {
    try {
      await providerAPIClient.deleteService(service.id);
      console.log(`Deleted Service: ${service.name}`);
    } catch (error) {
      console.error(`Failed to delete service ${service.name}:`, error);
    }
  }

  console.log("Global Teardown Successful");
}

export default globalTeardown;
