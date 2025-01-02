import { CacheProvider } from "@emotion/react";
import { ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import NProgress from "nprogress";
import Router, { useRouter } from "next/router";
import { Provider } from "react-redux";
import SnackbarProvider from "../src/components/SnackbarProvider/SnackbarProvider";
import NotificationBarProvider from "../src/context/NotificationBarProvider";
import createEmotionCache from "../src/createEmotionCache";
import { store } from "../src/redux-store";
import "../styles/globals.css";
import { theme as nonDashboardTheme } from "../styles/non-dashboard-theme";
import "../styles/quill-editor.css";
import "../styles/nprogress.css";
import "../src/components/DateRangePicker/date-range-picker-styles.css";
import "../styles/monaco-editor.css";
import { theme as dashboardTheme } from "../styles/theme";
import ProviderFavicon from "src/components/ProviderFavicon/ProviderFavicon";
import EnvironmentTypeProvider from "src/context/EnvironmentTypeProvider";
import { ENVIRONMENT_TYPES } from "src/constants/environmentTypes";
import { PAGE_TITLE_MAP } from "src/constants/pageTitleMap";
import Head from "next/head";
import AxiosGlobalErrorHandler from "src/providers/AxiosGlobalErrorHandler";

NProgress.configure({
  trickleSpeed: 50,
});

const startProgressBar = () => {
  NProgress.start();
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
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const router = useRouter();
  const isDashboardRoute = !nonDashboardRoutes.find((route) => {
    return route === router.pathname;
  });
  const pageTitle = PAGE_TITLE_MAP[router.pathname] || "Omnistrate";

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
                <AxiosGlobalErrorHandler />
                <ThemeProvider
                  theme={isDashboardRoute ? dashboardTheme : nonDashboardTheme}
                >
                  <EnvironmentTypeProvider envType={props.envType}>
                    <Component {...pageProps} />
                  </EnvironmentTypeProvider>
                </ThemeProvider>
              </NotificationBarProvider>
            </SnackbarProvider>
          </QueryClientProvider>
        </Provider>
      </CacheProvider>
    </>
  );
}

App.getInitialProps = async () => {
  //check for environment type in environment variables, default to prod
  return { envType: process.env.ENVIRONMENT_TYPE || ENVIRONMENT_TYPES.PROD };
};
