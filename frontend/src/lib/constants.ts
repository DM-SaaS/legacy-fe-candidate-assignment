export const STORAGE_KEYS = {
  SIGNATURE_HISTORY: 'web3_signature_history',
  THEME: 'web3_theme',
} as const;

export const MAX_MESSAGE_LENGTH = 10000;
export const MAX_HISTORY_ITEMS = 100;

export const MESSAGES = {
  SIGN_SUCCESS: 'Message signed successfully!',
  VERIFY_SUCCESS: 'Signature verified successfully!',
  VERIFY_FAILED: 'Signature verification failed.',
  NETWORK_ERROR: 'Network error. Please try again.',
  WALLET_NOT_CONNECTED: 'Please connect your wallet first.',
  COPIED_TO_CLIPBOARD: 'Copied to clipboard!',
} as const;
