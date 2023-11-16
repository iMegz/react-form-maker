import { useAuth0 } from "@auth0/auth0-react";
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

type Method = "get" | "delete" | "head" | "post" | "patch" | "put";

interface Options {
  body?: any;
  auth?: boolean;
  method?: Method;
  origin?: string;
}

interface RequestFn {
  <T = any>(endpoint: string, options?: Options): () => Promise<
    AxiosResponse<T>
  >;
}

const METHODS_WITH_BODY: Method[] = ["put", "patch", "post"];
const ORIGIN = import.meta.env.VITE_API;

const useRequest = () => {
  const { getAccessTokenSilently } = useAuth0();

  const request: RequestFn = <T = any>(
    endpoint: string,
    options: Options = {}
  ) => {
    const {
      method = "get",
      auth = true,
      body = null,
      origin = ORIGIN,
    } = options;
    const args: [AxiosRequestConfig<any>?] = [];

    return async () => {
      const path = origin + endpoint;
      if (METHODS_WITH_BODY.includes(method)) args.push(body);
      if (auth) {
        const token = await getAccessTokenSilently();
        const authorization = `Bearer ${token}`;
        args.push({ headers: { authorization } });
      }

      return axios[method]<T>(path, ...args);
    };
  };

  return request;
};

export default useRequest;
