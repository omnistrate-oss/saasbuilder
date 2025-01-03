import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type OrgDetails = {
  orgLogoURL: string;
  orgName: string;
  orgSupportEmail: string;
};

export const OrgDetailsContext = createContext<OrgDetails>(null);

const OrgDetailsProvider: FC<OrgDetails & { children: ReactNode }> = (
  props
) => {
  const { orgLogoURL, orgName, orgSupportEmail, children } = props;
  const [orgDetails, setOrgDetails] = useState<OrgDetails>({
    orgLogoURL,
    orgName,
    orgSupportEmail,
  });

  useEffect(() => {
    setOrgDetails({ orgLogoURL, orgName, orgSupportEmail });
  }, [orgLogoURL, orgName, orgSupportEmail]);

  return (
    <OrgDetailsContext.Provider value={orgDetails}>
      {children}
    </OrgDetailsContext.Provider>
  );
};

export default OrgDetailsProvider;

export const useOrgDetails = () => {
  return useContext(OrgDetailsContext);
};
