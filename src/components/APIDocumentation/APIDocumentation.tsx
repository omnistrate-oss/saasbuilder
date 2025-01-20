import useServiceApiDocsData from "src/hooks/useServiceApiDocsData";
import CardWithTitle from "../Card/CardWithTitle";
import SwaggerDocs from "../SwaggerDocs/SwaggerDocs";
import LoadingSpinner from "../LoadingSpinner/LoadingSpinner";

type APIDocumentationProps = {
  serviceId: string;
  serviceAPIID: string;
  actionButton?: React.ReactNode;
};

const APIDocumentation: React.FC<APIDocumentationProps> = ({
  serviceId,
  serviceAPIID,
  actionButton,
}) => {
  const { data: serviceAPIDocs, isLoading: isLoadingServiceAPIDocs } =
    useServiceApiDocsData(serviceId, serviceAPIID);

  if (!serviceAPIID) return null;

  return (
    <CardWithTitle
      title="API Documentation"
      style={{ minHeight: "500px" }}
      actionButton={actionButton}
    >
      {isLoadingServiceAPIDocs ? (
        <LoadingSpinner />
      ) : (
        <SwaggerDocs data={serviceAPIDocs} />
      )}
    </CardWithTitle>
  );
};

export default APIDocumentation;
