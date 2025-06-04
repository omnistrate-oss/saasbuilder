import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Alert, Snackbar } from "@mui/material";

import { setGlobalErrorHandler } from "src/api/client";
import { logoutBroadcastChannel } from "src/broadcastChannel";
import useLogout from "src/hooks/useLogout";

const GlobalErrorHandler = () => {
  const pathname = usePathname();
  const { handleLogout } = useLogout();
  const [isOpen, setIsOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");

  function handleClose() {
    setIsOpen(false);
    setSnackbarMsg("");
  }

  useEffect(() => {
    // listen to logout event from one tab and log out from all other tabs
    const handleMessage = (event) => {
      if (event.data === "logout") {
        const regex =
          /^\/(signin|signup|reset-password|validate-token|change-password|privacy-policy|cookie-policy|terms-of-use)$/;
        if (regex.test(pathname as string)) {
          return;
        }
        handleLogout();
      }
    };

    if (logoutBroadcastChannel) {
      logoutBroadcastChannel.addEventListener("message", handleMessage);
    }

    return () => {
      if (logoutBroadcastChannel) {
        logoutBroadcastChannel.removeEventListener("message", handleMessage);
      }
    };
  }, [pathname, handleLogout]);

  useEffect(() => {
    // Set up global error handler for openapi-fetch
    setGlobalErrorHandler((error: Error) => {
      setSnackbarMsg(error.message);
      setIsOpen(true);
    });

    return () => {
      setGlobalErrorHandler(null);
    };
  }, []);

  return (
    <Snackbar open={isOpen} autoHideDuration={5000} onClose={handleClose}>
      <Alert onClose={handleClose} variant="filled" severity={"error"} sx={{ width: "100%", fontWeight: 500 }}>
        {snackbarMsg}
      </Alert>
    </Snackbar>
  );
};

export default GlobalErrorHandler;
