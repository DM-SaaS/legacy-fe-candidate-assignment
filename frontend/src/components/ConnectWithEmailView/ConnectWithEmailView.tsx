import { type FC, type FormEventHandler, useRef, useState } from 'react';
import {
  useConnectWithOtp,
  useDynamicContext,
} from '@dynamic-labs/sdk-react-core';
import MessageSigner from '../MessageSigner/MessageSigner';

const ConnectWithEmailView: FC = () => {
  const { user, primaryWallet } = useDynamicContext();
  const { connectWithEmail, verifyOneTimePassword } = useConnectWithOtp();

  const [emailSubmitted, setEmailSubmitted] = useState(false);
  const [, setEmailValue] = useState('');
  const emailInputRef = useRef<HTMLInputElement | null>(null);
  const onSubmitEmailHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    await connectWithEmail(email);
    setEmailValue(email);
    setEmailSubmitted(true);
    if (emailInputRef.current) {
      emailInputRef.current.value = '';
    }
  };

  const onSubmitOtpHandler: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const otp = formData.get('otp') as string;
    await verifyOneTimePassword(otp);
  };

  return (
    <div className="w-full max-w-md mx-auto mt-10 p-6 rounded-lg shadow-lg bg-black text-white border border-blue-900">
      <h1 className="text-2xl font-bold text-blue-400 mb-6 text-center">
        🔐 Connect with Email
      </h1>

      {!user && (
        <>
          {!emailSubmitted ? (
            <form onSubmit={onSubmitEmailHandler} className="space-y-4">
              <input
                name="email"
                type="email"
                ref={emailInputRef}
                placeholder="Enter your email"
                className="w-full px-4 py-2 rounded-md bg-gray-900 text-white border border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <button
                type="submit"
                className="w-full cursor-pointer bg-blue-700 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition-colors"
              >
                Send OTP
              </button>
            </form>
          ) : (
            <form onSubmit={onSubmitOtpHandler} className="space-y-4">
              <input
                name="otp"
                type="text"
                placeholder="Enter OTP"
                autoComplete="one-time-code"
                className="w-full px-4 py-2 rounded-md bg-gray-900 text-white border border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-600"
                required
              />
              <button
                type="submit"
                className="w-full cursor-pointer bg-blue-700 hover:bg-blue-600 text-white font-semibold py-2 rounded-md transition-colors"
              >
                Verify OTP
              </button>
            </form>
          )}
        </>
      )}

      {user && (
        <div className="mt-6 space-y-6">
          <p className="font-bold text-green-400 text-lg flex items-center gap-2">
            ✅ Authenticated
          </p>

          <div className="bg-gray-800 p-4 rounded-md text-sm break-words border border-blue-800">
            <p className="text-gray-400 mb-1">Address:</p>
            <p className="text-blue-400">
              {user?.verifiedCredentials[0]?.address}
            </p>
          </div>

          <div className="w-full">
            <MessageSigner />
          </div>

          <button
            onClick={async () => {
              await primaryWallet?.connector?.endSession();
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }}
            className="w-full cursor-pointer bg-red-600 hover:bg-red-500 text-white font-semibold py-2 rounded-md transition-colors"
          >
            Log out
          </button>
        </div>
      )}
    </div>
  );
};

export default ConnectWithEmailView;
