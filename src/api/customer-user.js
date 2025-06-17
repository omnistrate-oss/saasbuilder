import axios from "axios";

export function customerUserSignup(payload) {
  return axios.post(`/api/signup`, payload);
}

export function customerUserSignin(payload) {
  return axios.post(`/api/signin`, payload);
}

export function customerUserResetPassword(payload) {
  return axios.post(`/api/reset-password`, payload);
}

export function getProviderOrgDetails() {
  return axios.get(`/api/provider-details`);
}

export function customerSignInWithIdentityProvider(payload) {
  return axios.post("/api/sign-in-with-idp", payload);
}
