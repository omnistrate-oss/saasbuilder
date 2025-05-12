import { createContext, useContext, useEffect, useState } from "react";

import { ProviderUser } from "src/types/users";

export const ProviderOrgDetailsContext = createContext<ProviderUser | undefined>(undefined);

export const useProviderOrgDetails = () => {
  const context = useContext(ProviderOrgDetailsContext);

  if (context === undefined) {
    throw new Error("useProviderOrgDetails must be used within a ProviderOrgDetailsProvider");
  }

  return context || {};
};

export default function ProviderOrgDetailsProvider(props: { details: ProviderUser; children: React.ReactNode }) {
  const { details, children } = props;
  const [providerOrgDetails, setProviderOrgDetails] = useState(details);

  useEffect(() => {
    setProviderOrgDetails(details);
  }, [details]);

  return <ProviderOrgDetailsContext.Provider value={providerOrgDetails}>{children}</ProviderOrgDetailsContext.Provider>;
}
