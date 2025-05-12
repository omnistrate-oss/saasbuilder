import Axios from "axios";
import Qs from "qs";

//omnistrate backend base url
import { baseURL } from "src/axios";
import { httpRequestMethods } from "src/server/utils/constants/httpsRequestMethods";
import { passwordRegex, passwordText as passwordRegexFailText } from "src/utils/passwordRegex";

const axios = Axios.create({
  baseURL: baseURL,
  paramsSerializer: (params) => Qs.stringify(params, { arrayFormat: "repeat" }),
});

const defaultErrorMessage = "";

export default async function handleAction(nextRequest, nextResponse) {
  axios.defaults.headers["Authorization"] = nextRequest.headers.authorization;
  if (nextRequest.method === "POST") {
    const { endpoint, method, data = {}, queryParams = {} } = nextRequest.body;

    if (endpoint && method && endpoint?.startsWith("/")) {
      let response = null;
      try {
        if (endpoint === "/change-password") {
          const password = data.password;
          if (password && typeof password === "string") {
            if (!password.match(passwordRegex)) {
              return nextResponse.status(400).send({ message: passwordRegexFailText });
            }
          }
        }
        if (method === httpRequestMethods.GET) {
          response = await axios.get(endpoint, {
            params: queryParams,
          });
        } else if (method === httpRequestMethods.POST) {
          response = await axios.post(
            endpoint,
            { ...data },
            {
              params: queryParams,
            }
          );
        } else if (method === httpRequestMethods.PATCH) {
          response = await axios.patch(
            endpoint,
            { ...data },
            {
              params: queryParams,
            }
          );
        } else if (method === httpRequestMethods.PUT) {
          response = await axios.put(
            endpoint,
            { ...data },
            {
              params: queryParams,
            }
          );
        } else if (method === httpRequestMethods.DELETE) {
          response = await axios.delete(endpoint, {
            data: { ...data },
            params: queryParams,
          });
        }
        if (response) {
          const data = response.data;
          const responseStatusCode = response.status;
          nextResponse.status(responseStatusCode);

          if (response.headers["content-type"] === "application/octet-stream") {
            return nextResponse.setHeader("content-type", response.headers["content-type"]).send(data);
          }
          if (data) nextResponse.send({ ...data });
          else nextResponse.send();
        }
      } catch (error) {
        console.error("Action Route error", error);
        const errorCode = error?.response?.status || 500;
        const errorMessage = error?.response?.data?.message || defaultErrorMessage;
        nextResponse.status(errorCode).send({
          message: errorMessage,
        });
      }
    }
  }

  //respond with 500 by default
  nextResponse.status(500).send({ message: defaultErrorMessage });
}

export const config = {
  api: {
    responseLimit: false,
  },
};
