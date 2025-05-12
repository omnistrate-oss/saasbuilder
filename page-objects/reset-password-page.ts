import { Page } from "@playwright/test";

import { PageURLs } from "./pages";

export class ResetPasswordPage {
  page: Page;

  dataTestIds = {
    emailInput: "email-input",
    submitButton: "submit-button",
    goToLoginButton: "go-to-login-button",
  };

  pageElements = {
    title: "Reset Password",
    heading: "Reset your password",
    successHeading: "Check Your Email for a Password Reset Link",

    emailRequiredText: "Email is required",
    invalidEmailText: "Invalid email address",
  };

  constructor(page: Page) {
    this.page = page;
  }

  async navigate() {
    await this.page.goto(PageURLs.resetPassword);
  }
}
