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
//   return axios.post("/identity-provider-render", payload).catch((error) => {
//     console.log("list identity provider error", error);
//     if (error.response && error.response.status === 401) {
//       throw new ProviderAuthError();
//     } else {
//       throw error;
//     }
//   });
// }

function getRenderIdentityProvidersList() {
  const dummyData = {
    data: {
      identityProviders: [
        {
          emailIdentifiers: "company.com",
          id: "idp-12345672",
          identityProviderName: "GitHub",
          loginButtonIconUrl: "https://github.githubassets.com/assets/GitHub-Mark-ea2971cee799.png",
          loginButtonText: "Login with Github",
          name: "Github for my company",
          renderedAuthorizationEndpoint:
            "https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=624788127633-tjff5dsp8jk62b282fqafpmm6k2ficir.apps.googleusercontent.com&redirect_uri=https://omnistrate-dev-access-ui.fly.dev&scope=openid email profile&state=idpName-guid",
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
            "https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=624788127633-tjff5dsp8jk62b282fqafpmm6k2ficir.apps.googleusercontent.com&redirect_uri=https://omnistrate-dev-access-ui.fly.dev&scope=openid email profile&state=idpName-guid",
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
            "https://accounts.google.com/o/oauth2/auth?response_type=code&client_id=624788127633-tjff5dsp8jk62b282fqafpmm6k2ficir.apps.googleusercontent.com&redirect_uri=https://omnistrate-dev-access-ui.fly.dev&scope=openid email profile&state=idpName-guid",
          state: "state",
        },
      ],
    }
  
  };

  return Promise.resolve(dummyData);
}

module.exports = {
  getIdentityProvidersList: withProviderTokenExpirationHanding(getIdentityProvidersList),
  getRenderIdentityProvidersList: withProviderTokenExpirationHanding(getRenderIdentityProvidersList),
};
