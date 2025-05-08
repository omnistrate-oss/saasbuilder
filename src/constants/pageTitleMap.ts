import { getNotificationsRoute } from "src/utils/route/access/accessRoute";
import { getEventsRoute } from "src/utils/routes";

export const PAGE_TITLE_MAP = {
  "/signin": "Sign In",
  "/signup": "Sign Up",
  "/change-password": "Change Password",
  "/reset-password": "Reset Password",
  "/validate-token": "Validate Token",

  "/terms-of-use": "Terms of Use",
  "/privacy-policy": "Privacy Policy",

  "/dashboard": "Dashboard",
  "/instances": "Instances",
  "/cloud-accounts": "Cloud Accounts",
  "/custom-networks": "Customer Networks",
  "/access-control": "Access Control",
  [getEventsRoute()]: "Audit Logs",
  [getNotificationsRoute()]: "Alerts",
  "/settings": "Profile Settings",
  "/billing": "Billing",
  "/subscriptions": "Subscriptions",
  "/cost-explorer": "Cost Explorer",
};
