import test from "@playwright/test";

import { InstancesPage } from "page-objects/instances-page";
import { ResourceInstance } from "src/types/resourceInstance";
import { GlobalStateManager } from "test-utils/global-state-manager";

const logPrefix = "Instances -> Capacity Scaling Tests ->";
test.describe.configure({ mode: "serial" });

test.describe("Instances Page - Capacity Scaling Tests", () => {
  let instancesPage: InstancesPage, instance: ResourceInstance;

  test.beforeEach(async ({ page }) => {
    instancesPage = new InstancesPage(page);
    await instancesPage.navigate();

    if (!instance) {
      const apiClient = instancesPage.apiClient;
      const serviceOfferings = GlobalStateManager.getServiceOfferings();

      const date = GlobalStateManager.getDate();
      const serviceOffering = serviceOfferings.find(
        (offering) => offering.serviceName === `SaaSBuilder Postgres DT - ${date}`
      );

      const subscriptions = GlobalStateManager.getSubscriptions();
      const subscription = subscriptions.find(
        (sub) => sub.serviceId === serviceOffering?.serviceId && sub.productTierId === serviceOffering?.productTierID
      );

      if (!serviceOffering) {
        throw new Error("Service Offering not found");
      }

      const {
        serviceProviderId,
        serviceURLKey,
        serviceAPIVersion,
        serviceEnvironmentURLKey,
        serviceModelURLKey,
        productTierURLKey,
        resourceParameters,
      } = serviceOffering;

      instance = await apiClient.createInstance(
        serviceProviderId,
        serviceURLKey,
        serviceAPIVersion,
        serviceEnvironmentURLKey,
        serviceModelURLKey,
        productTierURLKey,
        resourceParameters?.[0].urlKey,
        subscription?.id || "",
        {
          cloud_provider: "aws",
          network_type: "PUBLIC",
          region: "ap-south-1",
          requestParams: {
            password: "a_secure_password",
            username: "username",
          },
        } as any
      );

      console.log(logPrefix, "Instance created:", instance);
    }
  });

  test("Wait for Running Instance -> Add Capacity to Instance", async () => {
    if (!instance.id) {
      throw new Error(`${logPrefix} Instance ID is not present`);
    }

    await instancesPage.waitForStatus(instance.id, "Running", logPrefix);
    await instancesPage.changeCapacity("add", instance.id, 1);
    await instancesPage.waitForStatus(instance.id, "Scaling Up", logPrefix);
  });

  // TODO: Fix this Test
  // test("Wait for Running Instance -> Remove Capacity from Instance", async () => {
  //   await instancesPage.waitForStatus(instance.id, "Running", logPrefix);
  //   await instancesPage.changeCapacity("remove", instance.id, 1);
  //   await instancesPage.waitForStatus(instance.id, "Scaling Down", logPrefix);
  // });
});
