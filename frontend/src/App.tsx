import './App.css';

import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { AuthProvider } from './context/AuthContext';
import { AppRoutes } from './routes/AppRoutes';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { DYNAMIC_ENVIRONMENT_ID } from './constants';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <DynamicContextProvider
        settings={{
          environmentId: DYNAMIC_ENVIRONMENT_ID,
          walletConnectors: [EthereumWalletConnectors],
        }}
      >
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </DynamicContextProvider>
    </QueryClientProvider>
  );
}

export default App;
