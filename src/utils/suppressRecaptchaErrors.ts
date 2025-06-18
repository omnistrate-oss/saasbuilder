/**
 * Suppresses unhandled promise rejections from Google reCAPTCHA v2 invisible
 * These are known issues with Google's script that cannot be caught by user code
 *
 * Note: This analyzes JavaScript error stack traces, not URLs, to identify reCAPTCHA-related errors
 */

// Extend the Window interface to include our custom property
declare global {
  interface Window {
    __recaptchaErrorHandlerAdded?: boolean;
    __recaptchaErrorHandler?: (event: PromiseRejectionEvent) => void;
  }
}

interface RecaptchaError {
  message?: string;
  stack?: string;
  toString?: () => string;
}

export function suppressRecaptchaErrors(): void {
  // Only add the listener once
  if (typeof window !== "undefined" && !window.__recaptchaErrorHandlerAdded) {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason as RecaptchaError;

      // Convert reason to string for analysis
      const errorString = reason?.toString?.() || reason?.message || "";
      const stackString = reason?.stack || "";

      // SECURITY NOTE: We are analyzing JavaScript error stack traces here, NOT URLs
      // The stack traces contain function call information from script execution
      // This is safe because we're not making security decisions based on URL parsing

      // Check for reCAPTCHA timeout errors with various patterns
      const isRecaptchaTimeoutError =
        // Basic timeout error check with reCAPTCHA context
        (errorString.includes("Timeout") || errorString.includes("timeout")) &&
        // Check for reCAPTCHA context indicators in stack traces
        (stackString.includes("recaptcha") ||
          // More specific Google reCAPTCHA domain patterns in stack traces
          stackString.includes("www.google.com/recaptcha") ||
          stackString.includes("www.gstatic.com/recaptcha") ||
          stackString.includes("gstatic") ||
          stackString.includes("bfram") ||
          errorString.includes("bfram") ||
          // Check for reCAPTCHA script presence in DOM
          document.querySelector('script[src*="recaptcha"]') ||
          document.querySelector('script[src*="gstatic.com"]') ||
          document.querySelector('iframe[src*="recaptcha"]') ||
          // Check for specific timeout patterns like "Timeout (B)", "Timeout (i)", "Timeout (1)", etc.
          /Timeout\s*\([a-zA-Z0-9]\)/.test(errorString) ||
          // Additional patterns for reCAPTCHA errors
          /^Timeout \([a-zA-Z0-9]\)/.test(errorString));

      if (isRecaptchaTimeoutError) {
        event.preventDefault(); // Prevent the error from appearing in console
        return;
      }

      // Additional check for bfram errors (these are definitely reCAPTCHA related)
      const isBframError =
        errorString.includes("bfram") ||
        stackString.includes("bfram") ||
        // Check for errors that mention timeout and have bfram context
        (errorString.includes("Timeout") &&
          (errorString.includes("bfram") || (event as any).filename?.includes("bfram")));

      if (isBframError) {
        event.preventDefault();
        return;
      }

      // Fallback: Check for any timeout error that might be reCAPTCHA related
      const isPossibleRecaptchaError =
        errorString.includes("Timeout") &&
        // If we can't definitively identify it but reCAPTCHA is loaded
        (document.querySelector('script[src*="recaptcha"]') ||
          document.querySelector('script[src*="gstatic.com"]') ||
          document.querySelector('iframe[src*="recaptcha"]'));

      if (isPossibleRecaptchaError) {
        console.warn("Suppressed possible reCAPTCHA timeout error (reCAPTCHA detected on page):", errorString);
        event.preventDefault();
      }
    };

    // Store the handler reference for cleanup
    window.__recaptchaErrorHandler = handleUnhandledRejection;
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    // Mark that we've added the handler
    window.__recaptchaErrorHandlerAdded = true;
  }
}

export function cleanupRecaptchaErrorHandler(): void {
  if (typeof window !== "undefined") {
    // Remove the event listener if it exists
    if (window.__recaptchaErrorHandler) {
      window.removeEventListener("unhandledrejection", window.__recaptchaErrorHandler);
      window.__recaptchaErrorHandler = undefined;
    }

    // Reset the flag
    window.__recaptchaErrorHandlerAdded = false;
  }
}
