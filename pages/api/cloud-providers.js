import { getCloudProviders } from "src/server/api/cloud-providers";

export default async function handleGetCloudProviders(nextRequest, nextResponse) {
  if (nextRequest.method === "GET") {
    try {
      const response = await getCloudProviders();

      nextResponse.status(200).send(response);
    } catch (error) {
      const defaultErrorMessage = "Something went wrong. Please retry";

      if (error.name === "ProviderAuthError" || error?.response?.status === undefined) {
        nextResponse.status(500).send({
          message: defaultErrorMessage,
        });
      } else {
        nextResponse.status(error.response?.status || 500).send({
          message: error.response?.data?.message || defaultErrorMessage,
        });
      }
    }
  } else {
    nextResponse.status(404).json({
      message: "Endpoint not found",
    });
  }
}
