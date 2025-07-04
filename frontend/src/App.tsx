import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import './App.css';
import ConnectWithEmailView from './components/ConnectWithEmailView/ConnectWithEmailView';
import Header from './components/Header/Header';
import { envParameters } from './lib/constants';

const App = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-blue-950 text-white flex items-center justify-center px-4">
      <Header className="fixed top-0 left-0 w-full z-50" />
      <DynamicContextProvider
        settings={{
          environmentId: envParameters.environmentId,
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
        <ConnectWithEmailView />
      </DynamicContextProvider>
    </div>
  );
};

export default App;
