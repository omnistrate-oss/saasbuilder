import useServiceApiDocsData from "src/hooks/useServiceApiDocsData";
import CardWithTitle from "../Card/CardWithTitle";
import SwaggerDocs from "../SwaggerDocs/SwaggerDocs";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

type APIDocumentationProps = {
  subscription: any;
  serviceAPIID: string;
};

const APIDocumentation: React.FC<APIDocumentationProps> = ({
  subscription,
  serviceAPIID,
}) => {
  const { data: serviceAPIDocs, isLoading: isLoadingServiceAPIDocs } =
    useServiceApiDocsData(
      subscription?.serviceId,
      serviceAPIID,
      subscription?.id
    );

  if (!subscription || !serviceAPIID) return null;

  return (
    <CardWithTitle title="API Documentation" style={{ minHeight: "500px" }}>
      {isLoadingServiceAPIDocs ? (
        <LoadingSpinner />
      ) : (
        <SwaggerDocs data={serviceAPIDocs} />
      )}
    </CardWithTitle>
  );
};

export default APIDocumentation;
