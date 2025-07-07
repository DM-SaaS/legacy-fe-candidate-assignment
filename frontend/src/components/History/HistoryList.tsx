import React from 'react';
import { SignedMessage } from '../../types';
import { HistoryItem } from './HistoryItem';
import { motion, AnimatePresence } from 'framer-motion';

interface HistoryListProps {
  history: SignedMessage[];
}

export const HistoryList: React.FC<HistoryListProps> = ({ history }) => {
  if (history.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          No signed messages yet
        </p>
        <p className="text-sm text-gray-400 dark:text-gray-500 mt-2">
          Sign a message to see it here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto">
      <AnimatePresence>
        {history.map((item, index) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.05 }}
          >
            <HistoryItem item={item} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
