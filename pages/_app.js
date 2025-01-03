import { CacheProvider } from "@emotion/react";
import { Alert, Snackbar, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NProgress from "nprogress";
import Router, { useRouter } from "next/router";
import { useState } from "react";
import { Provider } from "react-redux";
import axios, { baseURL } from "../src/axios";
import SnackbarProvider from "../src/components/SnackbarProvider/SnackbarProvider";
import NotificationBarProvider from "../src/context/NotificationBarProvider";
import createEmotionCache from "../src/createEmotionCache";
import useLogout from "../src/hooks/useLogout";
import { store } from "../src/redux-store";
import "../styles/globals.css";
import { theme as nonDashboardTheme } from "../styles/non-dashboard-theme";
import "../styles/quill-editor.css";
import "../styles/nprogress.css";
import "../src/components/DateRangePicker/date-range-picker-styles.css";
import "../styles/monaco-editor.css";
import { theme as dashboardTheme } from "../styles/theme";
import _ from "lodash";
import ProviderFavicon from "src/components/ProviderFavicon/ProviderFavicon";
import EnvironmentTypeProvider from "src/context/EnvironmentTypeProvider";
import { ENVIRONMENT_TYPES } from "src/constants/environmentTypes";
import { PAGE_TITLE_MAP } from "src/constants/pageTitleMap";
import Head from "next/head";
import CookieConsentProvider from "src/context/cookieConsentContext";
import { getProviderOrgDetails } from "src/server/api/customer-user";
import OrgDetailsProvider from "src/context/OrgDetailsProvider";

NProgress.configure({
  trickleSpeed: 50,
});

const startProgressBar = () => {
  // const newUrlPath = url?.split("?")[0];
  //if (newUrlPath !== Router.pathname) {
  NProgress.start();
  //}
};

const stopProgressBar = () => {
  if (NProgress.isStarted()) {
    NProgress.done();
  }
};

Router.onRouteChangeStart = startProgressBar;
Router.onRouteChangeComplete = stopProgressBar;
Router.onRouterChangeError = stopProgressBar;

const clientSideEmotionCache = createEmotionCache();
const queryQlient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      retryOnMount: false,
    },
  },
});

const nonDashboardRoutes = [
  "/404",
  "/signin",
  "/signup",
  "/change-password",
  "/reset-password",
];

export default function App(props) {
  const [isOpen, setIsOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter();
  const isDashboardRoute = !nonDashboardRoutes.find((route) => {
    return route === router.pathname;
  });
  const pageTitle = PAGE_TITLE_MAP[router.pathname] || "Omnistrate";
  const { handleLogout } = useLogout();

  function handleClose() {
    setIsOpen(false);
    setSnackbarMsg("");
  }

  axios.interceptors.request.use((config) => {
    if (!config.url.startsWith("/api") && config.url.startsWith("/")) {
      // console.log("Axios request original config", _.cloneDeep(config));

      //the original request url
      const originalRequestURL = config.url;
      //the original request method
      const originalRequestMethod = config.method;
      //the original request payload
      const originalRequestPayload = _.cloneDeep(config.data);
      const orignalRequestQueryParams = _.cloneDeep(config.params);

      //requestMetaData is the payload that will be sent to the next js endpoint
      //it contains information about the original request
      const requestMetaData = {
        endpoint: originalRequestURL,
        method: _.upperCase(originalRequestMethod),
      };
      if (originalRequestPayload) {
        //console.log("Request payload present", requestPayload);
        requestMetaData.data = originalRequestPayload;
      }
      if (orignalRequestQueryParams) {
        requestMetaData.queryParams = orignalRequestQueryParams;
      }
      config.params = { endpoint: originalRequestURL };

      config.baseURL = "";
      config.url = "/api/action";
      config.method = "post";

      config.data = requestMetaData;
      // console.log("Axios request final config", config);
    }
    return config;
  });

  axios.interceptors.response.use(
    (response) => {
      return response;
    },
    async function (error) {
      const ignoreGlobalErrorSnack = error.config.ignoreGlobalErrorSnack; //state passed with each request to suppress the global snackbar errors if true the errors are ignore
      if (error.response && error.response.status === 401) {
        if (`${baseURL}/signin` !== error.request.responseURL) {
          handleLogout();
        }
      } else if (
        error.response &&
        error.response.data &&
        !ignoreGlobalErrorSnack
      ) {
        const status = String(error.response.status);
        if (status.startsWith("4") || status.startsWith("5")) {
          const message = error.response.data.message;
          const ignoredMessages = [
            "You have not been subscribed to a service yet.",
            "Your provider has not enabled billing for the user.",
            "You have not been enrolled in a service plan with a billing plan yet.",
            "Your provider has not enabled billing for the services.",
          ];
          if (!ignoredMessages.includes(message)) {
            if (message) {
              setSnackbarMsg(message);
              setIsOpen(true);
            } else {
              setSnackbarMsg("Something went wrong please try again later");
              setIsOpen(true);
            }
          }
        }
      }

      return Promise.reject(error);
    }
  );

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
      </Head>
      <CacheProvider value={emotionCache}>
        <Provider store={store}>
          <QueryClientProvider client={queryQlient}>
            <ProviderFavicon />
            <SnackbarProvider>
              <NotificationBarProvider>
                <ThemeProvider
                  theme={isDashboardRoute ? dashboardTheme : nonDashboardTheme}
                >
                  <EnvironmentTypeProvider envType={props.envType}>
                    <OrgDetailsProvider
                      orgLogoURL={props.orgLogoURL}
                      orgName={props.orgName}
                      orgSupportEmail={props.orgSupportEmail}
                    >
                      <CookieConsentProvider>
                        <Component {...pageProps} />
                      </CookieConsentProvider>
                    </OrgDetailsProvider>
                  </EnvironmentTypeProvider>
                </ThemeProvider>
              </NotificationBarProvider>
            </SnackbarProvider>
          </QueryClientProvider>
        </Provider>
      </CacheProvider>
      <Snackbar open={isOpen} autoHideDuration={5000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          variant="filled"
          severity={"error"}
          sx={{ width: "100%", fontWeight: 500 }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </>
  );
}

App.getInitialProps = async () => {
  let orgName = "";
  let orgLogoURL = "";
  let orgSupportEmail = "";

  try {
    await getProviderOrgDetails().then((response) => {
      orgName = response.data.orgName;
      orgLogoURL = response.data.orgLogoURL;
      orgSupportEmail = response.data.orgSupportEmail || response.data.email;
    });
  } catch (err) {}

  //check for environment type in environment variables, default to prod
  return {
    envType: process.env.ENVIRONMENT_TYPE || ENVIRONMENT_TYPES.PROD,
    orgName,
    orgLogoURL,
    orgSupportEmail,
  };
};
