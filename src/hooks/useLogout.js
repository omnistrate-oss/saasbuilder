import Cookies from "js-cookie";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { usePathname, useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

import axios from "../axios";
import { initialiseUserData } from "src/slices/userDataSlice";
import { logoutBroadcastChannel } from "src/broadcastChannel";

function useLogout() {
  const router = useRouter();
  const dispatch = useDispatch();
  const pathname = usePathname();
  const QueryClient = useQueryClient();

  // remove token from cookies, remove other user data and redirect to signin
  function handleLogout() {
    Cookies.remove("token");
    localStorage.removeItem("paymentNotificationHidden");
    try {
      localStorage.removeItem("loggedInUsingSSO");
    } catch (error) {
      console.warn("Failed to clear SSO state:", error);
    }

    router.replace("/signin");
  }

  useEffect(() => {
    if (pathname === "/signin") {
      dispatch(initialiseUserData());
      QueryClient.clear();
    }
  }, [pathname]);

  // make backend call and invalidate the token
  function logout() {
    axios
      .post("/logout")
      .then(() => {
        handleLogout();
      })
      .catch(() => {
        handleLogout();
      })
      .finally(() => {
        //broadcasts the logout event to other windows and tabs to log them out
        if (logoutBroadcastChannel) {
          try {
            logoutBroadcastChannel.postMessage("logout");
          } catch (error) {
            console.error(
              "Failed to post message on broadcast channel:",
              error
            );
          }
        }
      });
  }

  return { handleLogout, logout };
}

export default useLogout;
