import type React from 'react';
import { FileText } from 'lucide-react';
import { SignedMessageItem } from './SignMessageItem';
import { EmptyMessagesState } from './EmptyMessageState';
import { LoadingState } from './LoadingState';

interface SignedMessage {
  originalMessage: string;
  signedMessage: string;
  signer: string;
}

interface SignedMessagesListProps {
  messages?: SignedMessage[];
  isLoading: boolean;
}

export const SignedMessagesList: React.FC<SignedMessagesListProps> = ({
  messages = [],
  isLoading,
}) => {
  const renderContent = () => {
    if (isLoading) {
      return <LoadingState message="Loading messages..." />;
    }

    if (messages.length === 0) {
      return <EmptyMessagesState />;
    }

    return (
      <div className="space-y-4">
        {messages.map((message, index) => (
          <SignedMessageItem key={index} message={message} index={index} />
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
          <FileText className="h-5 w-5 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Signed Messages</h2>
        {messages && messages.length > 0 && (
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {messages.length} {messages.length === 1 ? 'message' : 'messages'}
          </span>
        )}
      </div>

      {renderContent()}
    </div>
  );
};
