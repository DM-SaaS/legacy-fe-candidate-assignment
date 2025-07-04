import { envParameters } from '../lib/constants';

export const verifySignature = async (message: string, signature: string) => {
  const res = await fetch(`${envParameters.baseApiUrl}/verify-signature`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message, signature }),
  });

  if (!res.ok) throw new Error('Failed to verify signature');

  return res.json();
};
