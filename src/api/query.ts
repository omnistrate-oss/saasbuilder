import createClient from "openapi-react-query";

import { apiClient } from "./client";

export const $api = createClient(apiClient);
