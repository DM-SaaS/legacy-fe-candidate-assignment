import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import "./index.css";

const queryClient = new QueryClient();

if (!import.meta.env.VITE_DYNAMIC_ENV_ID) {
  throw new Error("VITE_DYNAMIC_ENV_ID is not set");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <DynamicContextProvider
        settings={{
          environmentId: import.meta.env.VITE_DYNAMIC_ENV_ID,
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
        <App />
      </DynamicContextProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
