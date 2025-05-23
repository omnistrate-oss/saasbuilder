const axios = require("../axios");
const ProviderAuthError = require("../utils/ProviderAuthError");
const withProviderTokenExpirationHanding = require("../utils/withProviderTokenExpirationHandling");

function getIdentityProvidersList(payload) {
  return axios.get("/identity-provider", payload).catch((error) => {
    console.log("list identity provider error", error);
    if (error.response && error.response.status === 401) {
      throw new ProviderAuthError();
    } else {
      throw error;
    }
  });
}

// function getRenderIdentityProvidersList(payload) {
//   return axios.post("/identity-provider/render", payload).catch((error) => {
//     console.log("list identity provider error", error);
//     if (error.response && error.response.status === 401) {
//       throw new ProviderAuthError();
//     } else {
//       throw error;
//     }
//   });
// }

function getRenderIdentityProvidersList(payload) {
  const dummyData = {
    identityProviders: [
      {
        emailIdentifiers: "company.com",
        id: "idp-12345672",
        identityProviderName: "GitHub",
        loginButtonIconUrl: "https://example.com/icon.png",
        loginButtonText: "Login with Github",
        name: "Github for my company",
        renderedAuthorizationEndpoint:
          "https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=205376496935-vtfpdnseqmjhsynlh0bsufl38k0test.apps.googleusercontent.com&redirect_uri=https://example.com/redirect&scope=openid email profile&state=idpName-guid",
        state: "state",
      },
      {
        emailIdentifiers: "company.com",
        id: "idp-12345678",
        identityProviderName: "Google",
        loginButtonIconUrl: "https://example.com/icon.png",
        loginButtonText: "Login with Google",
        name: "Google for my company",
        renderedAuthorizationEndpoint:
          "https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=205376496935-vtfpdnseqmjhsynlh0bsufl38k0test.apps.googleusercontent.com&redirect_uri=https://example.com/redirect&scope=openid email profile&state=idpName-guid",
        state: "state",
      },
      {
        emailIdentifiers: "company.com",
        id: "idp-12345675",
        identityProviderName: "AmazonCognito",
        loginButtonIconUrl: "",
        loginButtonText: "",
        name: "Amazon for my company",
        renderedAuthorizationEndpoint:
          "https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=205376496935-vtfpdnseqmjhsynlh0bsufl38k0test.apps.googleusercontent.com&redirect_uri=https://example.com/redirect&scope=openid email profile&state=idpName-guid",
        state: "state",
      },
    ],
  };

  return Promise.resolve(dummyData);
}

module.exports = {
  getIdentityProvidersList: withProviderTokenExpirationHanding(getIdentityProvidersList),
  getRenderIdentityProvidersList: withProviderTokenExpirationHanding(getRenderIdentityProvidersList),
};
