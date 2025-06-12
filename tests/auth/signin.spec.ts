import test, { expect } from "@playwright/test";
import { PageURLs } from "page-objects/pages";
import { SigninPage } from "page-objects/signin-page";
import { ProviderAPIClient } from "test-utils/provider-api-client";

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

    //check that the other sign in  options button is visible
    await expect(page.getByTestId(signinPage.dataTestIds.otherSignInOptionsButton)).toBeVisible();
    await page.getByTestId(signinPage.dataTestIds.otherSignInOptionsButton).click();
    if (process.env.DISABLE_PASSWORD_LOGIN !== "true") {
      //check that the password login button is visible
      await expect(page.getByTestId(signinPage.dataTestIds.passwordLoginButton)).toBeVisible();
      page.getByTestId(signinPage.dataTestIds.passwordLoginButton).click();

      // Check Forgot Password and Create Account Links
      if (process.env.ENVIRONMENT_TYPE === "PROD") {
        await expect(page.getByRole("link", { name: "Forgot Password" })).toHaveAttribute(
          "href",
          PageURLs.resetPassword
        );
        await expect(page.getByRole("link", { name: "Sign Up" })).toHaveAttribute("href", PageURLs.signup);
      } else {
        await expect(page.getByRole("link", { name: "Forgot Password" })).not.toBeVisible();
        await expect(page.getByRole("link", { name: "New to Omnistrate? Sign Up" })).not.toBeVisible();
      }

      //check that the email input is disabled
      await expect(page.getByTestId(signinPage.dataTestIds.emailInput)).toBeDisabled();
      //check that the password input is visible
      await expect(page.getByTestId(signinPage.dataTestIds.passwordInput)).toBeVisible();
      //test password required validation
      await page.getByTestId(signinPage.dataTestIds.passwordInput).fill("");
      await page.getByTestId(signinPage.dataTestIds.passwordInput).blur();

      await expect(page.locator("#password-helper-text")).toContainText(signinPage.pageElements.passwordRequiredText);
    } else {
      await expect(page.getByTestId(signinPage.dataTestIds.passwordLoginButton)).toBeHidden();
    }
  });

  test("Login", async ({ page }) => {
    await signinPage.signInWithPassword();

    // Wait for Instances Page to Load
    await page.waitForURL(PageURLs.instances);
  });

  test("Forgot Password Action", async ({ page }) => {
    const dataTestIds = signinPage.dataTestIds;
    await signinPage.goToPasswordLoginStep();
    // Check Forgot Password Link
    if (process.env.ENVIRONMENT_TYPE === "PROD") {
      await expect(page.getByRole("link", { name: "Forgot Password" })).toHaveAttribute("href", PageURLs.resetPassword);
      await page.getByRole("link", { name: "Forgot Password" }).click();
      //heading should be visible
      await expect(page.getByRole("heading", { name: "Reset your password" })).toBeVisible();
      await page.getByTestId(dataTestIds.emailInput).fill(process.env.USER_EMAIL!);
      await page.getByTestId(dataTestIds.resetPasswordSubmitButton).click();
      // Check for success message
      await expect(page.getByRole("heading", { name: "Check Your Email for a Password Reset Link" })).toBeVisible();
    } else {
      await expect(page.getByRole("link", { name: "Forgot Password" })).not.toBeVisible();
    }
  });

  test("Cookie Settings Banner", async ({ page }) => {
    const dataTestIds = signinPage.dataTestIds,
      pageElements = signinPage.pageElements;

    await expect(page.getByTestId(dataTestIds.cookieConsentBanner)).toBeVisible();
    await expect(page.getByTestId(dataTestIds.cookieConsentBanner)).toContainText(pageElements.cookieConsentText);

    // Click on Allow All
    await expect(page.getByRole("link", { name: pageElements.cookiePolicyText })).toHaveAttribute(
      "href",
      PageURLs.cookiePolicy
    );
    await page.getByRole("button", { name: "Allow all" }).click();
    await expect(page.getByTestId(dataTestIds.cookieConsentBanner)).not.toBeVisible();

    // Click on Cookie Settings Text
    await page.getByText("Cookie Settings").click();
    await expect(page.getByTestId(dataTestIds.cookieConsentBanner)).toBeVisible();

    // Click on Allow Necessary
    await page.getByRole("button", { name: "Allow necessary" }).click();
    await expect(page.getByTestId(dataTestIds.cookieConsentBanner)).not.toBeVisible();
  });

  test("identity-providers", async ({ page }) => {
    const apiClient = new ProviderAPIClient();

    const identityProviders = await apiClient.getIdentityProviders();
    console.log("Identity Providers:", identityProviders);
    const dataTestIds = signinPage.dataTestIds;

    await signinPage.goToLoginOptionsStep();
    if (identityProviders.length > 0) {

      //get the email input from the email field
     const emailInput = await page.getByTestId(dataTestIds.emailInput).inputValue();
     console.log("Email Input:", emailInput);
      // expect(signinPage.dataTestIds.otherSignInOptionsButton);
      // Check that the other sign in options button is visible
    }
  });
});
