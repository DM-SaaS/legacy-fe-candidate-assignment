import type { ReactNode } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context';

const Container = styled.div`
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1rem;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
`;

const Header = styled.header`
  display: flex;
  flex-direction: column;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #eaeaea;
`;

const HeaderTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-size: 1.75rem;
  color: #111;
  margin: 0;
  font-weight: 600;
`;

const Description = styled.p`
  color: #666;
  font-size: 1rem;
  margin: 0.5rem 0 0;
`;

const LogoutButton = styled.button`
  background-color: transparent;
  color: #3861fb;
  border: 1px solid #3861fb;
  border-radius: 6px;
  padding: 0.5rem 1rem;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
  
  &:hover {
    background-color: #f5f8ff;
  }
`;

const UserInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const WalletAddress = styled.div`
  font-size: 0.875rem;
  color: #666;
  padding: 0.25rem 0.75rem;
  background-color: #f5f8ff;
  border-radius: 6px;
  font-family: monospace;
`;

const Main = styled.main`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Footer = styled.footer`
  text-align: center;
  margin-top: 3rem;
  padding-top: 1rem;
  color: #777;
  font-size: 0.875rem;
  border-top: 1px solid #eaeaea;
`;

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { isAuthenticated, walletAddress, logout } = useAuth();
  
  return (
    <Container>
      <Header>
        <HeaderTop>
          <Title>Web3 Message Signer</Title>
          {isAuthenticated && walletAddress && (
            <UserInfo>
              <WalletAddress>
                {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
              </WalletAddress>
              <LogoutButton onClick={() => logout()}>Logout</LogoutButton>
            </UserInfo>
          )}
        </HeaderTop>
        <Description>
          Authenticate with your wallet, sign custom messages, and verify signatures.
        </Description>
      </Header>
      
      <Main>
        {children}
      </Main>
      
      <Footer>
        &copy; {new Date().getFullYear()} Web3 Message Signer
      </Footer>
    </Container>
  );
};

export default Layout; 