import React, { useState } from 'react';
import { Clock, CheckCircle, XCircle, Eye, Trash2, RefreshCw } from 'lucide-react';
import type { SignedMessage } from '../types';
import { useClipboard } from '../hooks/useClipboard';
import { useSignatureVerification } from '../hooks/useSignatureVerification';
import { APP_CONFIG, UI_TEXT } from '../constants';
import { formatTimestamp, truncateText } from '../utils';

interface SignatureHistoryProps {
  history: SignedMessage[];
  onUpdateMessage: (id: string, updates: Partial<SignedMessage>) => void;
  onRemoveMessage: (id: string) => void;
  onClearHistory: () => void;
}

export const SignatureHistory: React.FC<SignatureHistoryProps> = ({
  history,
  onUpdateMessage,
  onRemoveMessage,
  onClearHistory,
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { copy } = useClipboard();
  const { verifySignature, isVerifying } = useSignatureVerification();

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleVerifySignature = (message: SignedMessage) => {
    verifySignature(message, onUpdateMessage);
  };

  if (history.length === 0) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {UI_TEXT.NO_HISTORY}
          </h3>
          <p className="text-gray-500">
            {UI_TEXT.NO_HISTORY_DESCRIPTION}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="card-header">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                {UI_TEXT.SIGNATURE_HISTORY}
              </h2>
              <p className="text-sm text-gray-500">
                {history.length} message{history.length !== 1 ? 's' : ''} signed
              </p>
            </div>
          </div>
          {history.length > 0 && (
            <button
              onClick={onClearHistory}
              className="btn-danger text-sm"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {history.map((message) => (
          <div key={message.id} className="border border-gray-200 rounded-lg p-4 bg-white">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  {message.verificationResult ? (
                    message.verificationResult.isValid ? (
                      <CheckCircle className="w-4 h-4 text-success-600" />
                    ) : (
                      <XCircle className="w-4 h-4 text-error-600" />
                    )
                  ) : (
                    <div className="w-4 h-4 rounded-full bg-gray-300" />
                  )}
                  <span className="text-sm text-gray-500">
                    {formatTimestamp(message.timestamp)}
                  </span>
                  {message.verificationResult && (
                    <span
                      className={`badge ${
                        message.verificationResult.isValid ? 'badge-success' : 'badge-error'
                      }`}
                    >
                      {message.verificationResult.isValid ? 'Valid' : 'Invalid'}
                    </span>
                  )}
                </div>

                <div className="mb-3">
                  <p className="text-sm text-gray-900 break-words">
                    {truncateText(message.message, APP_CONFIG.MESSAGE_DISPLAY_LENGTH)}
                  </p>
                </div>

                {expandedId === message.id && (
                  <div className="space-y-3 mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Full Message
                      </label>
                      <p className="text-sm text-gray-900 break-words font-mono bg-white p-2 rounded border border-gray-200">
                        {message.message}
                      </p>
                      <button
                        onClick={() => copy(message.message, 'Message')}
                        className="mt-1 text-xs text-accent-600 hover:text-accent-700 transition-colors duration-150"
                      >
                        Copy message
                      </button>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Signature
                      </label>
                      <p className="text-sm text-gray-900 break-all font-mono bg-white p-2 rounded border border-gray-200">
                        {message.signature}
                      </p>
                      <button
                        onClick={() => copy(message.signature, 'Signature')}
                        className="mt-1 text-xs text-accent-600 hover:text-accent-700 transition-colors duration-150"
                      >
                        Copy signature
                      </button>
                    </div>

                    {message.verificationResult && (
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Verified Signer
                        </label>
                        <p className="text-sm text-gray-900 break-all font-mono bg-white p-2 rounded border border-gray-200">
                          {message.verificationResult.signer || 'Unknown'}
                        </p>
                        {message.verificationResult.signer && (
                          <button
                            onClick={() => copy(message.verificationResult!.signer!, 'Signer address')}
                            className="mt-1 text-xs text-accent-600 hover:text-accent-700 transition-colors duration-150"
                          >
                            Copy signer address
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => toggleExpanded(message.id)}
                  className="btn-secondary text-sm p-2"
                >
                  <Eye className="w-4 h-4" />
                </button>

                <button
                  onClick={() => handleVerifySignature(message)}
                  disabled={isVerifying(message.id)}
                  className="btn-primary text-sm p-2"
                >
                  {isVerifying(message.id) ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  ) : (
                    <RefreshCw className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={() => onRemoveMessage(message.id)}
                  className="btn-danger text-sm p-2"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 