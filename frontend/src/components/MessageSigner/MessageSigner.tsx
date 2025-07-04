import { useState } from 'react';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import { verifySignature as callVerifyAPI } from '../../utils/api';

const MessageSigner = () => {
  const { primaryWallet } = useDynamicContext();

  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<
    { message: string; signature: string }[]
  >([]);
  const [verifiedSigner, setVerifiedSigner] = useState('');
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const truncate = (str: string) =>
    str.length > 20 ? `${str.slice(0, 10)}...${str.slice(-10)}` : str;

  const handleSignMessage = async () => {
    setError('');
    setVerifiedSigner('');
    setIsValid(null);
    try {
      if (!primaryWallet) {
        setError('Wallet not connected or signer not available');
        return;
      }

      const signedMessage = (await primaryWallet.signMessage(message)) ?? '';
      setSignature(signedMessage);

      const entry = { message, signature: signedMessage };
      const newHistory = [...history, entry];
      setHistory(newHistory);
      localStorage.setItem('signedMessages', JSON.stringify(newHistory));
      const result = await callVerifyAPI(message, signedMessage);
      setIsValid(result.isValid);
      setVerifiedSigner(result.signer);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="space-y-4 w-full max-w-full">
      <p className="text-blue-400 font-semibold">✍️ Sign a Custom Message</p>

      <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
        <input
          type="text"
          placeholder="Enter message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-4 py-2 rounded-md bg-gray-900 text-white border border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSignMessage}
          className="w-full cursor-pointer sm:w-auto bg-blue-700 hover:bg-blue-600 text-white font-semibold px-4 py-2 rounded-md transition-colors"
        >
          Sign
        </button>
      </div>

      {signature && (
        <div className="text-sm bg-gray-900 p-3 rounded-md border border-blue-800 text-green-400 break-all w-full">
          <span className="text-gray-400">Signature:</span>{' '}
          <span>{truncate(signature)}</span>
        </div>
      )}

      {error && (
        <p className="text-red-400 text-sm bg-gray-900 p-2 rounded-md border border-red-600 w-full">
          {error}
        </p>
      )}

      {isValid !== null && (
        <div className="text-sm bg-gray-900 p-3 rounded-md border border-blue-800 w-full">
          <p
            className={`font-semibold ${
              isValid ? 'text-green-400' : 'text-red-400'
            }`}
          >
            Signature is {isValid ? 'valid ✅' : 'invalid ❌'}
          </p>
          {verifiedSigner && (
            <p className="text-gray-400 break-words">
              <span className="mr-1">Signer:</span>
              <span className="text-blue-400">{truncate(verifiedSigner)}</span>
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MessageSigner;
