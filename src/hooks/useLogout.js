import Cookies from "js-cookie";
import { useRouter } from "next-nprogress-bar";

import axios from "../axios";

function useLogout() {
  const router = useRouter();

  //remove token from cookies, remove other user data and redirect to signin
  function handleLogout() {
    Cookies.remove("token");
    localStorage.removeItem("paymentNotificationHidden");
    router.replace(
      "/signin",
      {},
      {
        showProgressBar: true,
      }
    );
  }

  //make backend call and invalidate the token
  function logout() {
    axios
      .post("/logout")
      .then(() => {
        handleLogout();
      })
      .catch(() => {
        handleLogout();
      });
  }

  return { handleLogout, logout };
}

export default useLogout;
