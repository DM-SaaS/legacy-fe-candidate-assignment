import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useAuth } from '../../context';
import { useMessageHistory } from '../../hooks/useMessageHistory';
import { verifySignature } from '../../services/api';

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
  border: 1px solid #eaeaea;
`;

const FormHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const FormTitle = styled.h3`
  font-size: 1.125rem;
  color: #111;
  margin: 0;
  font-weight: 600;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const TextArea = styled.textarea`
  padding: 0.75rem;
  border-radius: 6px;
  border: 1px solid #ddd;
  min-height: 100px;
  font-family: inherit;
  resize: vertical;
  font-size: 0.95rem;
  
  &:focus {
    outline: none;
    border-color: #3861fb;
    box-shadow: 0 0 0 2px rgba(56, 97, 251, 0.1);
  }
  
  &:disabled {
    background-color: #f9f9f9;
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  border: none;
  background-color: #3861fb;
  color: #fff;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.95rem;

  &:hover {
    background-color: #2d4edb;
  }

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }
`;


const StatusMessage = styled.div<{ $success?: boolean }>`
  padding: 0.75rem;
  margin-top: 1rem;
  border-radius: 6px;
  background-color: ${props => props.$success ? '#e6f7e6' : '#f5f7ff'};
  color: ${props => props.$success ? '#2e7d32' : '#333'};
  border: 1px solid ${props => props.$success ? '#c8e6c9' : '#e0e0e0'};
  font-size: 0.9rem;
`;

const WalletInfo = styled.div`
  padding: 0.5rem 0.75rem;
  color: #444;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
`;

const WalletIndicator = styled.div<{ $connected: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: ${props => props.$connected ? '#10b981' : '#ef4444'};
`;

const NoWalletMessage = styled.div`
  padding: 1rem;
  margin: 0.5rem 0 1rem;
  background-color: #fffbeb;
  border: 1px solid #fef3c7;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #92400e;
`;

const MessageForm = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { isAuthenticated, walletAddress, signMessage } = useAuth();
  const { addMessage, updateVerification, messageHistory } = useMessageHistory();

  useEffect(() => {
    console.log('MessageForm has access to messageHistory:', messageHistory);
  }, [messageHistory]);

  const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || !isAuthenticated || !walletAddress) {
      setIsSuccess(false);
      setStatus('Please connect your wallet first');
      return;
    }
    
    setIsLoading(true);
    setStatus('Signing message with your wallet...');
    setIsSuccess(false);
    
    try {
      console.log('Attempting to sign message with wallet:', walletAddress);
      
      const signature = await signMessage(message);
      
      if (signature) {
        setStatus('Message signed successfully, verifying...');
        
       
        const entry = addMessage(message, signature);
        console.log('Added message to history:', entry);
        
        
        const result = await verifySignature(message, signature);
        
        if (result.isValid) {
          setIsSuccess(true);
          setStatus(`Signature verified! Signer: ${result.signer}`);
        } else {
          setIsSuccess(false);
          setStatus(`Verification failed: ${result.error || 'Unknown error'}`);
        }
        
       
        updateVerification(entry.timestamp, result);
        console.log('Updated verification result:', result);
      } else {
        setIsSuccess(false);
        setStatus('Failed to sign message - check your wallet connection');
      }
    } catch (error) {
      console.error('Error signing or verifying message:', error);
      setIsSuccess(false);
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
      setMessage('');
    }
  };

  return (
    <FormContainer>
      <FormHeader>
        <FormTitle>Sign Message</FormTitle>
      </FormHeader>
      
      {walletAddress ? (
        <WalletInfo>
          <WalletIndicator $connected={true} />
          Connected: {walletAddress.substring(0, 6)}...{walletAddress.substring(walletAddress.length - 4)}
        </WalletInfo>
      ) : (
        <NoWalletMessage>
          <strong>No wallet connected.</strong> Please connect an Ethereum wallet to sign messages.
        </NoWalletMessage>
      )}
      
      <StyledForm onSubmit={handleSubmit}>
        <TextArea
          value={message}
          onChange={handleMessageChange}
          placeholder="Enter a message to sign..."
          required
          disabled={!isAuthenticated || !walletAddress || isLoading}
        />
        <Button 
          type="submit" 
          disabled={!isAuthenticated || !walletAddress || !message.trim() || isLoading}
        >
          {isLoading ? 'Signing...' : 'Sign Message'}
        </Button>
      </StyledForm>
      
      {status && <StatusMessage $success={isSuccess}>{status}</StatusMessage>}
    </FormContainer>
  );
};

export default MessageForm; 