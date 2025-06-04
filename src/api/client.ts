import Cookies from "js-cookie";
import createFetchClient from "openapi-fetch";

import { paths } from "src/types/schema";

export const baseDomain = process.env.NEXT_PUBLIC_BACKEND_BASE_DOMAIN || "https://api.omnistrate.cloud";

let globalErrorHandler: ((error: Error) => void) | null = null;
export function setGlobalErrorHandler(handler: ((error: Error) => void) | null) {
  globalErrorHandler = handler;
}

export const defaultClient = createFetchClient();
export const apiClient = createFetchClient<paths>();

apiClient.use({
  onRequest({ request }) {
    const token = Cookies.get("token");
    if (token) {
      request.headers.set("Authorization", `Bearer ${token}`);
    }

    const url = new URL(request.url);
    const pathname = url.pathname;

    if (!pathname.startsWith("/api") && pathname.startsWith("/")) {
      // Store original request details
      const originalRequestURL = pathname;
      const originalRequestMethod = request.method;

      // Get original request body
      let originalRequestPayload;
      if (request.body) {
        // Clone the body since it can only be read once
        originalRequestPayload = request.clone().body;
      }

      // Get original query parameters
      const originalRequestQueryParams = Object.fromEntries(url.searchParams);

      // Create request metadata
      const requestMetaData: {
        endpoint: string;
        method: string;
        data?: any;
        queryParams?: Record<string, string>;
      } = {
        endpoint: originalRequestURL,
        method: originalRequestMethod.toUpperCase(),
      };

      if (originalRequestPayload) {
        requestMetaData.data = originalRequestPayload;
      }
      if (Object.keys(originalRequestQueryParams).length > 0) {
        requestMetaData.queryParams = originalRequestQueryParams;
      }

      // Modify the request
      const newUrl = new URL("/api/action", url.origin);
      newUrl.searchParams.set("endpoint", originalRequestURL);

      // Create new request with modified properties
      const modifiedRequest = new Request(newUrl.toString(), {
        method: "POST",
        headers: request.headers,
        body: JSON.stringify(requestMetaData),
      });

      // Ensure Content-Type is set for JSON
      modifiedRequest.headers.set("Content-Type", "application/json");

      return modifiedRequest;
    }

    return request;
  },

  async onResponse({ response, request }) {
    if (!response.ok) {
      const ignoreGlobalErrorSnack = request.headers.get("x-ignore-global-error");

      if (response.status === 401) {
        // Check if this isn't the signin URL to avoid redirect loops
        if (!response.url.endsWith("/signin")) {
          Cookies.remove("token");
          localStorage.removeItem("paymentNotificationHidden");
          try {
            localStorage.removeItem("loggedInUsingSSO");
          } catch (error) {
            console.warn("Failed to clear SSO state:", error);
          }

          window.location.href = "/signin";
        }
      } else if (!ignoreGlobalErrorSnack && globalErrorHandler) {
        const status = String(response.status);

        if (status.startsWith("4") || status.startsWith("5")) {
          try {
            // Check if response has content before trying to parse JSON
            const contentType = response.headers.get("content-type");
            const hasJsonContent = contentType && contentType.includes("application/json");
            const responseText = await response.clone().text();

            let message = "Something went wrong please try again later";

            if (hasJsonContent && responseText.trim()) {
              try {
                const error = JSON.parse(responseText);
                message = error.message || message;
              } catch (parseError) {
                console.warn("Failed to parse error response as JSON:", parseError);
                // Use responseText as message if it's not empty
                if (responseText.trim()) {
                  message = responseText;
                }
              }
            } else if (responseText.trim()) {
              // Use response text if available
              message = responseText;
            }

            const ignoredMessages = [
              "You have not been subscribed to a service yet.",
              "Your provider has not enabled billing for the user.",
              "You have not been enrolled in a service plan with a billing plan yet.",
              "Your provider has not enabled billing for the services.",
            ];

            if (!ignoredMessages.includes(message)) {
              globalErrorHandler(new Error(message));
            }
          } catch (error) {
            console.warn("Error handling response:", error);
            // Fallback to generic error message
            globalErrorHandler(new Error("Something went wrong please try again later"));
          }
        }
      }
    }

    return response;
  },
});
