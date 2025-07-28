import styled from 'styled-components';
import { useMessageHistory } from '../../hooks/useMessageHistory';
import { format } from 'date-fns';
import { useEffect } from 'react';

const HistoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  background-color: #ffffff;
  border: 1px solid #eaeaea;
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
`;

const HistoryTitle = styled.h3`
  font-size: 1.125rem;
  color: #111;
  margin: 0;
  font-weight: 600;
`;

const ClearButton = styled.button`
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  border: 1px solid #ef4444;
  background-color: transparent;
  color: #ef4444;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    background-color: #fef2f2;
  }
`;

const MessageList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-height: 450px;
  overflow-y: auto;
`;

const MessageItem = styled.div`
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid #eaeaea;
  background-color: #fafafa;
`;

const MessageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.75rem;
  font-size: 0.8rem;
  color: #666;
`;

const MessageContent = styled.div`
  margin-bottom: 0.75rem;
  word-break: break-word;
  font-size: 0.95rem;
`;

const SignatureText = styled.div`
  font-family: monospace;
  font-size: 0.8rem;
  color: #555;
  background-color: #f5f5f5;
  padding: 0.5rem;
  border-radius: 6px;
  overflow-x: auto;
  white-space: nowrap;
  margin-bottom: 0.75rem;
`;

const VerificationBadge = styled.div<{ valid: boolean }>`
  display: inline-flex;
  align-items: center;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.5rem;
  background-color: ${props => props.valid ? '#ecfdf5' : '#fef2f2'};
  color: ${props => props.valid ? '#047857' : '#b91c1c'};
  border: 1px solid ${props => props.valid ? '#d1fae5' : '#fee2e2'};
`;

const SignerInfo = styled.div`
  margin-top: 0.5rem;
  font-size: 0.85rem;
  
  strong {
    font-weight: 500;
    color: #555;
  }
`;

const NoMessages = styled.div`
  text-align: center;
  padding: 2rem;
  color: #666;
  font-size: 0.95rem;
  background-color: #fafafa;
  border-radius: 6px;
`;

const MessageHistory = () => {
  const { messageHistory, clearHistory } = useMessageHistory();

  useEffect(() => {
    console.log('MessageHistory rendering with:', messageHistory);
  }, [messageHistory]);

  if (messageHistory.length === 0) {
    return (
      <HistoryContainer>
        <HistoryHeader>
          <HistoryTitle>Message History</HistoryTitle>
        </HistoryHeader>
        <NoMessages>No signed messages yet</NoMessages>
      </HistoryContainer>
    );
  }

  return (
    <HistoryContainer>
      <HistoryHeader>
        <HistoryTitle>Message History</HistoryTitle>
        {messageHistory.length > 0 && (
          <ClearButton onClick={clearHistory}>Clear All</ClearButton>
        )}
      </HistoryHeader>
      
      <MessageList>
        {messageHistory.map((item) => (
          <MessageItem key={item.timestamp}>
            <MessageHeader>
              <span>
                {format(new Date(item.timestamp), 'MMM dd, yyyy HH:mm:ss')}
              </span>
            </MessageHeader>
            
            <MessageContent>
              <strong>Message:</strong> {item.message}
            </MessageContent>
            
            <div>
              <strong>Signature:</strong>
              <SignatureText>{item.signature.substring(0, 64)}...</SignatureText>
            </div>
            
            {item.verification && (
              <div>
                <VerificationBadge valid={item.verification.isValid}>
                  {item.verification.isValid ? 'Valid ✓' : 'Invalid ✗'}
                </VerificationBadge>
                {item.verification.isValid && (
                  <SignerInfo>
                    <strong>Signer:</strong> {item.verification.signer}
                  </SignerInfo>
                )}
                {!item.verification.isValid && item.verification.error && (
                  <SignerInfo style={{ color: '#b91c1c' }}>
                    <strong>Error:</strong> {item.verification.error}
                  </SignerInfo>
                )}
              </div>
            )}
          </MessageItem>
        ))}
      </MessageList>
    </HistoryContainer>
  );
};

export default MessageHistory; 