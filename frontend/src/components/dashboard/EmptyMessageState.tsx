import type React from 'react';
import { FilePenLineIcon as Signature } from 'lucide-react';

export const EmptyMessagesState: React.FC = () => {
  return (
    <div className="text-center py-12">
      <Signature className="h-12 w-12 text-gray-300 mx-auto mb-4" />
      <p className="text-gray-500 text-lg">No signed messages yet</p>
      <p className="text-gray-400 text-sm">
        Sign your first message above to get started
      </p>
    </div>
  );
};
