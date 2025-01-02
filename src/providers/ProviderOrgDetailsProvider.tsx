import { createContext, useContext, useEffect, useState } from "react";

export const ProviderOrgDetailsContext = createContext(null);

export const useProviderOrgDetails = () => {
  const context: any = useContext(ProviderOrgDetailsContext); // TODO: Add a Type Here

  if (context === undefined) {
    throw new Error(
      "useProviderOrgDetails must be used within a ProviderOrgDetailsProvider"
    );
  }

  return context || {};
};

export default function ProviderOrgDetailsProvider(props) {
  const { details, children } = props;
  const [providerOrgDetails, setProviderOrgDetails] = useState(details);

  useEffect(() => {
    setProviderOrgDetails(details);
  }, [details]);

  return (
    <ProviderOrgDetailsContext.Provider value={providerOrgDetails}>
      {children}
    </ProviderOrgDetailsContext.Provider>
  );
}
