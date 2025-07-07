import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { MESSAGES } from '../lib/constants';

export const useClipboard = () => {
  const [isCopying, setIsCopying] = useState(false);

  const copyToClipboard = useCallback(async (text: string) => {
    if (!text) return;

    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(text);
      toast.success(MESSAGES.COPIED_TO_CLIPBOARD);
    } catch (error) {
      toast.error('Failed to copy to clipboard');
    } finally {
      setIsCopying(false);
    }
  }, []);

  return { copyToClipboard, isCopying };
};
