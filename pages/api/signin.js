import { customerUserSignIn } from "src/server/api/customer-user";

export default async function handleSignIn(nextRequest, nextResponse) {
  if (nextRequest.method === "POST") {
    try {
      const response = await customerUserSignIn(nextRequest.body);
      nextResponse.status(200).send({ ...response.data });
    } catch (error) {
      let defaultErrorMessage =
        "Failed to sign in. Either the credentials are incorrect or the user does not exist";

      if (
        error.name === "ProviderAuthError" ||
        error?.response?.status === undefined
      ) {
        nextResponse.status(500).send({
          message: defaultErrorMessage,
        });
      } else if (
        error.response?.data?.message === "wrong user email or password"
      ) {
        nextResponse.status(400).send({
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
