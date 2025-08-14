import type React from 'react';
import {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';

export interface OtpInputProps {
  length?: number;
  value?: string[];
  onChange?: (value: string[]) => void;
  onComplete?: (value: string) => void;
  error?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export interface OtpInputRef {
  focus: () => void;
  clear: () => void;
}

export const OtpInput = forwardRef<OtpInputRef, OtpInputProps>(
  (
    {
      length = 6,
      value = [],
      onChange,
      onComplete,
      error,
      disabled = false,
      autoFocus = false,
      className = '',
    },
    ref
  ) => {
    const [otp, setOtp] = useState<string[]>(
      value.length ? value : Array(length).fill('')
    );
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        inputRefs.current[0]?.focus();
      },
      clear: () => {
        const newOtp = Array(length).fill('');
        setOtp(newOtp);
        onChange?.(newOtp);
        inputRefs.current[0]?.focus();
      },
    }));

    useEffect(() => {
      if (value.length) {
        setOtp(value);
      }
    }, [value]);

    useEffect(() => {
      if (autoFocus) {
        inputRefs.current[0]?.focus();
      }
    }, [autoFocus]);

    const handleChange = (index: number, inputValue: string) => {
      if (inputValue.length > 1) return;

      const newOtp = [...otp];
      newOtp[index] = inputValue;
      setOtp(newOtp);
      onChange?.(newOtp);

      // Auto-focus next input
      if (inputValue && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }

      // Check if OTP is complete
      if (inputValue && newOtp.every((digit) => digit !== '')) {
        onComplete?.(newOtp.join(''));
      }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
      if (e.key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }

      if (e.key === 'ArrowLeft' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }

      if (e.key === 'ArrowRight' && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text/plain').slice(0, length);
      const newOtp = Array(length).fill('');

      for (let i = 0; i < pastedData.length; i++) {
        if (/^\d$/.test(pastedData[i])) {
          newOtp[i] = pastedData[i];
        }
      }

      setOtp(newOtp);
      onChange?.(newOtp);

      // Focus the next empty input or the last input
      const nextEmptyIndex = newOtp.findIndex((digit) => digit === '');
      const focusIndex = nextEmptyIndex !== -1 ? nextEmptyIndex : length - 1;
      inputRefs.current[focusIndex]?.focus();

      if (newOtp.every((digit) => digit !== '')) {
        onComplete?.(newOtp.join(''));
      }
    };

    const baseClasses =
      'w-12 h-12 text-center text-xl font-bold border rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:opacity-50 disabled:cursor-not-allowed';

    const stateClasses = error
      ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
      : 'border-gray-200 focus:border-blue-500 focus:ring-blue-500';

    return (
      <div className={className}>
        <div className="flex gap-2 justify-center">
          {otp.map((digit, index) => (
            <input
              key={index}
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              //@ts-ignore
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              disabled={disabled}
              className={`${baseClasses} ${stateClasses}`}
              aria-label={`Digit ${index + 1} of ${length}`}
            />
          ))}
        </div>

        {error && (
          <p className="mt-2 text-sm text-red-600 text-center">{error}</p>
        )}
      </div>
    );
  }
);

OtpInput.displayName = 'OtpInput';
