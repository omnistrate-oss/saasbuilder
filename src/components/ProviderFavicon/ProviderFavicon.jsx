import { useEffect } from "react";
import useProviderOrgDetails from "src/hooks/query/useProviderOrgDetails";

function ProviderFavicon() {
  const providerOrgDetailsQuery = useProviderOrgDetails();
  const { data: providerOrgDetails } = providerOrgDetailsQuery;

  useEffect(() => {
    if (providerOrgDetails && providerOrgDetails.providerOrgFaviconURL) {
      const providerFaviconLinkElement = document.getElementById("provider-favicon");
      if (providerFaviconLinkElement) {
        providerFaviconLinkElement.setAttribute("href", providerOrgDetails.providerOrgFaviconURL);
      }
    }
  }, [providerOrgDetails]);

  return <></>;
}

export default ProviderFavicon;
