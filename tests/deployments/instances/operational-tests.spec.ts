// import test from "@playwright/test";
// import { InstancesPage } from "@/page-objects/instances-page";
// import { ResourceInstance } from "@/saasbuilder/src/types/resourceInstance";
// import { GlobalStateManager } from "@/utils/global-state-manager";

// test.describe.configure({ mode: "serial", timeout: 10 * 60 * 1000 });

// test.describe("Instances Page - Operational Tests", () => {
//   let instancesPage: InstancesPage, instance: ResourceInstance;

//   test.beforeEach(async ({ page }) => {
//     instancesPage = new InstancesPage(page);
//     await instancesPage.navigate();

//     if (!instance) {
//       const apiClient = instancesPage.apiClient;
//       const serviceOfferings = GlobalStateManager.getServiceOfferings();
//       const serviceOffering = serviceOfferings.find((offering) =>
//         offering.serviceName.startsWith("Playwright Postgres DT - ")
//       );
//       const subscriptions = GlobalStateManager.getSubscriptions();
//       const subscription = subscriptions.find(
//         (sub) => sub.serviceId === serviceOffering?.serviceId && sub.productTierId === serviceOffering?.productTierID
//       );

//       if (!serviceOffering) {
//         throw new Error("Service Offering not found");
//       }

//       const {
//         serviceProviderId,
//         serviceURLKey,
//         serviceAPIVersion,
//         serviceEnvironmentURLKey,
//         serviceModelURLKey,
//         productTierURLKey,
//         resourceParameters,
//       } = serviceOffering;

//       instance = await apiClient.createInstance(
//         serviceProviderId,
//         serviceURLKey,
//         serviceAPIVersion,
//         serviceEnvironmentURLKey,
//         serviceModelURLKey,
//         productTierURLKey,
//         resourceParameters?.[0].urlKey,
//         subscription?.id,
//         {
//           cloud_provider: "aws",
//           network_type: "PUBLIC",
//           region: "ap-south-1",
//           requestParams: {
//             password: "a_secure_password",
//             username: "username",
//           },
//         } as any
//       );

//       console.log("Instance created:", instance);
//     }
//   });

//   test("Wait for Running Instance -> Reboot an Instance", async ({ page }) => {
//     await instancesPage.waitForStatus(instance.id, "Running");
//     await instancesPage.rebootInstance(instance.id);
//     await instancesPage.waitForStatus(instance.id, "Restarting");
//   });

//   test("Wait for Running Instance -> Modify an Instance", async ({ page }) => {
//     await instancesPage.waitForStatus(instance.id, "Running");
//     await instancesPage.selectInstance(instance.id);

//     await page.getByTestId("modify-button").click();
//     await page.getByTestId("password-input").fill("new_password");
//     await page.getByTestId("username-input").fill("new_username");
//     await page.getByTestId("submit-button").click();

//     await instancesPage.waitForStatus(instance.id, "Deploying");
//   });
// });
