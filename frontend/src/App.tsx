// src/App.tsx
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { MessageForm } from "./components/MessageForm";

function App() {
  const { primaryWallet } = useDynamicContext();
  const address = primaryWallet?.address as `0x${string}`;

  return (
    <div>
      <h1>📝 Web3 Message Signer</h1>

      {/* Login widget */}
      <DynamicWidget />

      {/* Wallet address */}
      {address && <p>Connected as: {address}</p>}

      {/* Message signer */}
      {address && <MessageForm address={address} />}
    </div>
  );
}

export default App;
