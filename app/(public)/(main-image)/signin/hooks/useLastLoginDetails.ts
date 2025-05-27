export function useLastLoginDetails() {
  const email = localStorage ? localStorage.getItem("lastLoginEmail") : "";
  const loginMethod: "Password" | string | null = localStorage ? localStorage.getItem("lastLoginMethod") : "";

  function setEmail(email: string) {
    localStorage.setItem("lastLoginEmail", email);
  }

  //Password or some IDP
  function setLoginMethod(loginMethod: {
    //'Password' or IDP type eg 'Google', 'Github'
    methodType: "Password" | string;
    idpName?: string;
  }) {
    const stringified = JSON.stringify(loginMethod);
    localStorage.setItem("lastLoginMethod", stringified);
  }

  return {
    email,
    loginMethod,
    setEmail,
    setLoginMethod,
  };
}
