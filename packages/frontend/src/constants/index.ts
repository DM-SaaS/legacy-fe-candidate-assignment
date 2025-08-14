export const APP_CONFIG = {
  MESSAGE_MAX_LENGTH: 10000,
  MESSAGE_PREVIEW_LENGTH: 50,
  MESSAGE_DISPLAY_LENGTH: 100,
  SIGNATURE_HISTORY_LIMIT: 50,
  COPY_FEEDBACK_DURATION: 2000,
  TOAST_DURATION: 4000,
  CHARACTER_WARNING_THRESHOLD: 9000,
} as const;

export const API_ENDPOINTS = {
  VERIFY_SIGNATURE: '/verify-signature',
  HEALTH_CHECK: '/health',
  MFA_SETUP: '/mfa/setup',
  MFA_VALIDATE: '/mfa/validate',
  MFA_VALIDATE_WITH_WINDOW: '/mfa/validate-with-window',
  MFA_TIME_REMAINING: '/mfa/time-remaining',
} as const;

export const VALIDATION_MESSAGES = {
  MESSAGE_REQUIRED: 'Message cannot be empty',
  MESSAGE_TOO_LONG: `Message too long (max ${APP_CONFIG.MESSAGE_MAX_LENGTH} characters)`,
  MESSAGE_WHITESPACE_ONLY: 'Message cannot be only whitespace',
  WALLET_NOT_CONNECTED: 'Please connect your wallet first',
  SIGNATURE_VERIFICATION_FAILED: 'Failed to verify signature',
  SIGNATURE_INVALID_FORMAT: 'Invalid signature format',
} as const;

export const UI_TEXT = {
  APP_TITLE: 'Web3 Message Signer',
  APP_DESCRIPTION: 'Securely sign messages with your Web3 wallet and verify signatures with cryptographic proof. Connect your wallet to get started with decentralized message authentication.',
  CONNECT_WALLET: 'Connect Wallet',
  DISCONNECT_WALLET: 'Disconnect Wallet',
  SIGN_MESSAGE: 'Sign Message',
  VERIFY_SIGNATURE: 'Verify Signature',
  SIGNATURE_HISTORY: 'Signature History',
  NO_HISTORY: 'No Signature History',
  NO_HISTORY_DESCRIPTION: 'Your signed messages will appear here once you start signing.',
  COPY_SUCCESS: 'copied to clipboard!',
  COPY_FAILED: 'Failed to copy to clipboard',
} as const;

export const WALLET_CONFIG = {
  ADDRESS_DISPLAY_LENGTH: {
    START: 6,
    END: 4,
  },
} as const;

export const REGEX_PATTERNS = {
  SIGNATURE_FORMAT: /^0x[a-fA-F0-9]{130}$/,
  ETHEREUM_ADDRESS: /^0x[a-fA-F0-9]{40}$/i,
} as const; 