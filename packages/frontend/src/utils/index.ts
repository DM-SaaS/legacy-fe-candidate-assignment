import { WALLET_CONFIG } from '../constants';

export const formatAddress = (address: string): string => {
  if (!address) return 'Unknown';
  const { START, END } = WALLET_CONFIG.ADDRESS_DISPLAY_LENGTH;
  return `${address.slice(0, START)}...${address.slice(-END)}`;
};

export const formatTimestamp = (timestamp: string): string => {
  return new Date(timestamp).toLocaleString();
};

export const generateSecureId = (): string => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    return false;
  }
};

export const sanitizeMessage = (message: string): string => {
  return message
    .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
    .replace(/[\u2000-\u200F\u2028-\u202F\u205F-\u206F]/g, ' ')
    .trim();
};

export const truncateText = (text: string, maxLength: number): string => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

export const debounce = <T extends (...args: any[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const isValidEthereumSignature = (signature: string): boolean => {
  return /^0x[a-fA-F0-9]{130}$/.test(signature);
};

export const isValidEthereumAddress = (address: string): boolean => {
  return /^0x[a-fA-F0-9]{40}$/i.test(address);
}; 