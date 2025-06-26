import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postRequest } from '../services/apiService';

interface VerifySignatureRequest {
  signature: string;
  message: string;
}

interface VerifySignatureResponse {
  success: boolean;
  token?: string;
  error?: string;
}

export const useVerifySignature = () => {
  const queryClient = useQueryClient();

  return useMutation<VerifySignatureResponse, Error, VerifySignatureRequest>({
    mutationFn: (data) =>
      postRequest<VerifySignatureResponse, VerifySignatureRequest>(
        '/verify-signature',
        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['verify-signature'],
      });
    },
  });
};
