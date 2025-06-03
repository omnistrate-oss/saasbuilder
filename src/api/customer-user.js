import { defaultClient } from "./client";

export function customerUserSignup(payload) {
  return defaultClient.POST("/api/signup", {
    body: payload,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function customerUserSignin(payload) {
  return defaultClient.POST("/api/signin", {
    body: payload,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function customerUserResetPassword(payload) {
  return defaultClient.POST("/api/reset-password", {
    body: payload,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function getProviderOrgDetails() {
  return defaultClient.GET("/api/provider-org-details");
}

export function customerSignInWithIdentityProvider(payload) {
  return defaultClient.POST("/api/sign-in-with-idp", {
    body: payload,
    headers: {
      "Content-Type": "application/json",
    },
  });
}
