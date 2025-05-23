// import SwaggerDocs from "../SwaggerDocs/SwaggerDocs";
import dynamic from "next/dynamic";

import useServiceApiDocsData from "src/hooks/useServiceApiDocsData";

import CardWithTitle from "../Card/CardWithTitle";
const SwaggerDocs = dynamic(() => import("../SwaggerDocs/SwaggerDocs"), {
  ssr: false,
});
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";
import { Text } from "../Typography/Typography";

type APIDocumentationProps = {
  serviceId: string;
  serviceAPIID: string;
};

const APIDocumentation: React.FC<APIDocumentationProps> = ({ serviceId, serviceAPIID }) => {
  const { data: serviceAPIDocs, isFetching: isFetchingAPIDocs } = useServiceApiDocsData(serviceId, serviceAPIID);

  if (!serviceAPIID) return null;

  return (
    <CardWithTitle title="API Documentation" style={{ minHeight: "500px" }}>
      {isFetchingAPIDocs ? (
        <LoadingSpinner />
      ) : !serviceAPIDocs ? (
        <div className="flex items-center justify-center" style={{ minHeight: "250px" }}>
          <Text size="medium" weight="semibold" sx={{ textAlign: "center" }}>
            API Documentation not available
          </Text>
        </div>
      ) : (
        <SwaggerDocs data={serviceAPIDocs} />
      )}
    </CardWithTitle>
  );
};

export default APIDocumentation;
