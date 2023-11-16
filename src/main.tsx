import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Auth0Provider } from "@auth0/auth0-react";
import { QueryClient, QueryClientProvider } from "react-query";

const redirect_uri = `${import.meta.env.VITE_ORIGIN}/dashboard/`;

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: Infinity } },
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
    authorizationParams={{ redirect_uri }}
  >
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </Auth0Provider>
);
