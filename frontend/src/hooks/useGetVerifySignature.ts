import { useQuery } from '@tanstack/react-query';
import { getRequest } from '../services/apiService';

interface VerifySignatureParams {
  signature?: string;
  message?: string;
  address?: string;
}

export interface SignedMessage {
  originalMessage: string;
  signedMessage: string;
}

export const useGetVerifySignature = (params: VerifySignatureParams) => {
  return useQuery<SignedMessage[], Error>({
    queryKey: ['verify-signature', params],
    queryFn: () =>
      getRequest<SignedMessage[], VerifySignatureParams>(
        '/verify-signature',
        params
      ),
    enabled: true,
  });
};
