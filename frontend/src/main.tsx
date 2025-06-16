import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import "./index.css";

if (!import.meta.env.VITE_DYNAMIC_ENV_ID) {
  throw new Error("VITE_DYNAMIC_ENV_ID is not set");
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DynamicContextProvider
      settings={{
        environmentId: import.meta.env.VITE_DYNAMIC_ENV_ID,
        walletConnectors: [EthereumWalletConnectors],
      }}
    >
      <App />
    </DynamicContextProvider>
  </React.StrictMode>
);
