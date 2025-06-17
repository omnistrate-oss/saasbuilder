export function useLastLoginDetails() {
  const email = localStorage ? localStorage.getItem("lastLoginEmail") : "";
  const loginMethod: "Password" | string | null = localStorage ? localStorage.getItem("lastLoginMethod") : "";

  function setEmail(email: string) {
    try {
      if (typeof window !== "undefined" && localStorage) {
        localStorage.setItem("lastLoginEmail", email);
      }
    } catch (error) {
      console.error("Error setting last login email in localStorage:", error);
    }
  }

  //Password or some IDP
  function setLoginMethod(loginMethod: {
    //'Password' or IDP type eg 'Google', 'Github'
    methodType: "Password" | string;
    idpName?: string;
  }) {
    try {
      if (typeof window !== "undefined" && localStorage) {
        const stringified = JSON.stringify(loginMethod);
        localStorage.setItem("lastLoginMethod", stringified);
      }
    } catch (error) {
      console.error("Error setting last login method in localStorage:", error);
    }
  }

  return {
    email,
    loginMethod,
    setEmail,
    setLoginMethod,
  };
}
