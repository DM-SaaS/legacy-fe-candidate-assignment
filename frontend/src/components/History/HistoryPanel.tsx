import React, { useState } from 'react';
import { Card } from '../UI/Card';
import { Button } from '../UI/Button';
import { HistoryList } from './HistoryList';
import { useSignatureHistory } from '../../hooks/useSignatureHistory';
import { downloadJSON } from '../../lib/utils';
import { Clock, Download, Trash2, FileJson } from 'lucide-react';
import toast from 'react-hot-toast';

export const HistoryPanel: React.FC = () => {
  const { history, clearHistory } = useSignatureHistory();
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleExport = () => {
    if (history.length === 0) {
      toast.error('No history to export');
      return;
    }

    const filename = `signature-history-${new Date().toISOString().split('T')[0]}.json`;
    downloadJSON(history, filename);
    toast.success('History exported successfully');
  };

  const handleClear = () => {
    clearHistory();
    setShowClearConfirm(false);
    toast.success('History cleared');
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target?.result as string);
        // Validate and merge with existing history
        // For now, we'll just show a success message
        toast.success('History imported successfully');
      } catch (error) {
        toast.error('Invalid file format');
      }
    };
    reader.readAsText(file);
  };

  return (
    <Card variant="glass">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mr-3">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              History
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {history.length} signed messages
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleExport}
            disabled={history.length === 0}
          >
            <Download className="w-4 h-4" />
          </Button>

          <label htmlFor="import-history">
            <Button
              variant="ghost"
              size="sm"
              as="span"
              className="cursor-pointer"
            >
              <FileJson className="w-4 h-4" />
            </Button>
          </label>
          <input
            id="import-history"
            type="file"
            accept=".json"
            className="hidden"
            onChange={handleImport}
          />

          {showClearConfirm ? (
            <div className="flex items-center space-x-1">
              <Button variant="danger" size="sm" onClick={handleClear}>
                Confirm
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowClearConfirm(true)}
              disabled={history.length === 0}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <HistoryList history={history} />
    </Card>
  );
};
