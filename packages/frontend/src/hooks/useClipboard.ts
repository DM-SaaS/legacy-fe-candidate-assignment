import { useState, useCallback } from 'react';
import toast from 'react-hot-toast';
import { copyToClipboard } from '../utils';
import { APP_CONFIG, UI_TEXT } from '../constants';

export const useClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string, type: string = 'Content') => {
    const success = await copyToClipboard(text);
    
    if (success) {
      setCopied(true);
      toast.success(`${type} ${UI_TEXT.COPY_SUCCESS}`);
      setTimeout(() => setCopied(false), APP_CONFIG.COPY_FEEDBACK_DURATION);
      return true;
    } else {
      toast.error(UI_TEXT.COPY_FAILED);
      return false;
    }
  }, []);

  return { copied, copy };
}; 