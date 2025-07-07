import React, { useState } from 'react';
import { SignedMessage } from '../../types';
import { Button } from '../UI/Button';
import { useClipboard } from '../../hooks/useClipboard';
import { useSignatureHistory } from '../../hooks/useSignatureHistory';
import { useMutation } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { formatDate, truncateAddress } from '../../lib/utils';
import {
  CheckCircle,
  XCircle,
  Copy,
  Trash2,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface HistoryItemProps {
  item: SignedMessage;
}

export const HistoryItem: React.FC<HistoryItemProps> = ({ item }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { copyToClipboard } = useClipboard();
  const { removeFromHistory, updateVerificationStatus } = useSignatureHistory();

  const verifyMutation = useMutation({
    mutationFn: api.verifySignature,
    onSuccess: (data) => {
      updateVerificationStatus(item.id, data.isValid);
      toast.success(
        data.isValid ? 'Signature is valid!' : 'Signature is invalid'
      );
    },
    onError: () => {
      toast.error('Failed to verify signature');
    },
  });

  const handleVerify = () => {
    verifyMutation.mutate({
      message: item.message,
      signature: item.signature,
    });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
              {item.message.length > 50
                ? `${item.message.substring(0, 50)}...`
                : item.message}
            </p>
            {item.verified !== undefined &&
              (item.verified ? (
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              ))}
          </div>

          <p className="text-xs text-gray-500 dark:text-gray-400">
            {formatDate(item.timestamp)}
          </p>

          {isExpanded && (
            <div className="mt-3 space-y-2">
              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Message:
                </p>
                <p className="text-sm text-gray-800 dark:text-gray-200 break-all bg-gray-100 dark:bg-gray-700 p-2 rounded">
                  {item.message}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Signature:
                </p>
                <div className="flex items-center space-x-2">
                  <code className="text-xs text-gray-700 dark:text-gray-300 break-all">
                    {truncateAddress(item.signature, 15)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(item.signature)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                  Signer:
                </p>
                <div className="flex items-center space-x-2">
                  <code className="text-xs text-gray-700 dark:text-gray-300">
                    {truncateAddress(item.signer)}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(item.signer)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center space-x-1 ml-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleVerify}
            disabled={verifyMutation.isPending}
          >
            <RefreshCw
              className={`w-3 h-3 ${verifyMutation.isPending ? 'animate-spin' : ''}`}
            />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronUp className="w-3 h-3" />
            ) : (
              <ChevronDown className="w-3 h-3" />
            )}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeFromHistory(item.id)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};
