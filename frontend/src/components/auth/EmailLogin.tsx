import styled from 'styled-components';
import { useAuth } from '../../context';
import { DynamicWidget, useDynamicContext } from '@dynamic-labs/sdk-react';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  max-width: 500px;
  margin: 0 auto 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
  border: 1px solid #eaeaea;
`;

const LoginHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
`;

const Title = styled.h3`
  font-size: 1.125rem;
  color: #111;
  margin: 0;
  font-weight: 600;
`;

const WalletInfo = styled.div`
  margin: 0.5rem 0 1rem;
  padding: 1rem;
  background-color: #f5f8ff;
  border-radius: 6px;
  width: 100%;
  border: 1px solid #e5edff;
`;

const Address = styled.p`
  font-size: 0.875rem;
  color: #555;
  word-break: break-all;
  margin: 0.5rem 0;
  font-family: monospace;
`;

const EmailInfo = styled.div`
  font-size: 0.875rem;
  color: #666;
  margin-top: 0.5rem;
  
  strong {
    color: #444;
    font-weight: 500;
  }
`;

const ConnectButton = styled.div`
  width: 100%;
  margin-top: 1rem;
`;

const Instructions = styled.div`
  margin: 0.75rem 0 1.5rem;
  padding: 1rem;
  background-color: #fffbeb;
  border: 1px solid #fef3c7;
  border-radius: 6px;
  font-size: 0.875rem;
  line-height: 1.5;
  color: #92400e;
  
  ol {
    margin: 0.75rem 0 0 1.25rem;
    padding: 0;
  }
  
  li {
    margin-bottom: 0.375rem;
  }
  
  strong {
    font-weight: 500;
  }
`;

const IntroText = styled.p`
  font-size: 0.95rem;
  color: #555;
  margin: 0 0 1rem;
`;

const DynamicAuth = () => {
  const { isAuthenticated, walletAddress } = useAuth();
  const { user } = useDynamicContext();

  const userEmail = user?.email || 'Not available';
  
  return (
    <LoginContainer>
      <LoginHeader>
        <Title>Authentication</Title>
      </LoginHeader>
      
      {isAuthenticated && walletAddress ? (
        <WalletInfo>
          <strong>Wallet Connected</strong>
          <Address>{walletAddress}</Address>
          {user && (
            <EmailInfo>
              <strong>Email:</strong> {userEmail}
            </EmailInfo>
          )}
        </WalletInfo>
      ) : (
        <>
          <IntroText>Connect your Ethereum wallet to sign and verify messages</IntroText>
          
          <Instructions>
            <strong>How to connect:</strong>
            <ol>
              <li>Sign in with your email</li>
              <li>After email verification, connect an Ethereum wallet (MetaMask, etc.)</li>
              <li>You must connect a wallet to sign messages</li>
            </ol>
          </Instructions>
          
          <ConnectButton>
            <DynamicWidget />
          </ConnectButton>
        </>
      )}
    </LoginContainer>
  );
};

export default DynamicAuth; 