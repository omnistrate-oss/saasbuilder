import test, { expect } from "@playwright/test";
import { PageURLs } from "page-objects/pages";
import { SigninPage } from "page-objects/signin-page";

test.describe("Signin Page", () => {
  let signinPage: SigninPage;

  test.beforeEach(async ({ page }) => {
    signinPage = new SigninPage(page);
    await signinPage.navigate();
  });

  test("email field validation", async ({ page }) => {
    const dataTestIds = signinPage.dataTestIds;
    await expect(page.getByTestId(dataTestIds.emailInput)).toBeVisible();
    await page.getByTestId(dataTestIds.emailInput).fill("invalid-email");
    await page.getByTestId(dataTestIds.nextButton).click();
    await expect(page.locator("#email-helper-text")).toContainText(signinPage.pageElements.invalidEmailText);
  });

  test("login-options-elements", async ({ page }) => {
    await signinPage.goToLoginOptionsStep();
  })

  // test("Overall Structure and Elements", async ({ page }) => {
  //   const pageElements = signinPage.pageElements,
  //     dataTestIds = signinPage.dataTestIds;
  //   await expect(page).toHaveTitle(pageElements.title);

  //   // Check Forgot Password and Create Account Links
  //   if (process.env.ENVIRONMENT_TYPE === "PROD") {
  //     await expect(page.getByRole("link", { name: "Forgot Password" })).toHaveAttribute("href", PageURLs.resetPassword);
  //     await expect(page.getByRole("link", { name: "Create Account" })).toHaveAttribute("href", PageURLs.signup);
  //   } else {
  //     await expect(page.getByRole("link", { name: "Forgot Password" })).not.toBeVisible();
  //     await expect(page.getByRole("link", { name: "Create Account" })).not.toBeVisible();
  //   }

  //   // Check for Google and Github Signin Buttons
  //   await expect(page.getByTestId(dataTestIds.googleSigninButton)).toBeVisible();
  //   await expect(page.getByTestId(dataTestIds.githubSigninButton)).toBeVisible();

  //   // Check Terms & Conditions and Privacy Policy Links
  //   await expect(page.getByRole("link", { name: pageElements.termsText })).toHaveAttribute("href", PageURLs.termsOfUse);
  //   await expect(page.getByRole("link", { name: pageElements.privacyPolicyText })).toHaveAttribute(
  //     "href",
  //     PageURLs.privacyPolicy
  //   );
  // });

  // test("Validation", async ({ page }) => {
  //   const dataTestIds = signinPage.dataTestIds,
  //     pageElements = signinPage.pageElements;

  //   // Base Validation
  //   await page.getByRole("button", { name: "Login" }).click();
  //   await expect(page.locator("#email-helper-text")).toContainText(pageElements.emailRequiredText);
  //   await expect(page.locator("#password-helper-text")).toContainText(pageElements.passwordRequiredText);

  //   // Enter Invalid Email
  //   await page.getByTestId(dataTestIds.emailInput).fill("invalid-email");
  //   await page.getByTestId(dataTestIds.passwordInput).click(); // Click on Password Field to Trigger Email Validation

  //   await expect(page.locator("#email-helper-text")).toContainText(pageElements.invalidEmailText);
  // });

  // test("Login", async ({ page }) => {
  //   await signinPage.signIn();

  //   // Wait for Instances Page to Load
  //   await page.waitForURL(PageURLs.instances);
  // });

  // test("Cookie Settings Banner", async ({ page }) => {
  //   const dataTestIds = signinPage.dataTestIds,
  //     pageElements = signinPage.pageElements;

  //   await expect(page.getByTestId(dataTestIds.cookieConsentBanner)).toBeVisible();
  //   await expect(page.getByTestId(dataTestIds.cookieConsentBanner)).toContainText(pageElements.cookieConsentText);

  //   // Click on Allow All
  //   await expect(page.getByRole("link", { name: pageElements.cookiePolicyText })).toHaveAttribute(
  //     "href",
  //     PageURLs.cookiePolicy
  //   );
  //   await page.getByRole("button", { name: "Allow all" }).click();
  //   await expect(page.getByTestId(dataTestIds.cookieConsentBanner)).not.toBeVisible();

  //   // Click on Cookie Settings Text
  //   await page.getByText("Cookie Settings").click();
  //   await expect(page.getByTestId(dataTestIds.cookieConsentBanner)).toBeVisible();

  //   // Click on Allow Necessary
  //   await page.getByRole("button", { name: "Allow necessary" }).click();
  //   await expect(page.getByTestId(dataTestIds.cookieConsentBanner)).not.toBeVisible();
  // });
});
