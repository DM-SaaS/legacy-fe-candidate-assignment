export type Address = `0x${string}`;

export interface IVerifySignaturePayload {
  message: string;
  signature: Address;
}

export interface IVerifySignatureResponse {
  isValid: boolean;
  signer: Address | null;
  originalMessage?: string | null;
  message?: string;
  details?: Record<string, any>;
}
