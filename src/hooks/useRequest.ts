import { useAuth0 } from "@auth0/auth0-react";
import axios, { AxiosResponse } from "axios";

type Method = "get" | "delete" | "head" | "post" | "patch" | "put";

interface Options {
  body?: any;
  auth?: boolean;
  method?: Method;
  origin?: string;
}

interface RequestFn {
  (endpoint: string, options?: Options): Promise<AxiosResponse<any, any>>;
}

export default function () {
  const { getAccessTokenSilently } = useAuth0();
  const methodsWithBody: Method[] = ["put", "patch", "post"];

  const request: RequestFn = async (endpoint, options = {}) => {
    const args = [];
    const {
      method = "get",
      auth = true,
      body = null,
      origin = import.meta.env.VITE_API,
    } = options;

    const path = origin + endpoint;

    if (methodsWithBody.includes(method)) args.push(body);

    if (auth) {
      const token = await getAccessTokenSilently();
      const authorization = `Bearer ${token}`;
      args.push({ headers: { authorization } });
    }

    return axios[method](path, ...args);
  };

  return request;
}
