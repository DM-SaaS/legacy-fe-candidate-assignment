import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MessageSigner from './MessageSigner';
import { verifySignature as mockVerifySignature } from '../../utils/api';

const mockSignMessage = jest.fn();

jest.mock('@dynamic-labs/sdk-react-core', () => ({
  useDynamicContext: jest.fn(() => ({
    primaryWallet: {
      signMessage: mockSignMessage,
    },
  })),
}));

jest.mock('../../utils/api', () => ({
  verifySignature: jest.fn(),
}));

describe('MessageSigner', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it('renders input and sign button', () => {
    render(<MessageSigner />);
    expect(screen.getByPlaceholderText(/enter message/i)).toBeInTheDocument();
    setTimeout(() => {
      expect(screen.getByText(/sign/i)).toBeInTheDocument();
    });
  });

  it('signs message and verifies signature', async () => {
    const longSignature = '0x1234567890abcdef1234567890abcdef12345678';
    const signerAddress = '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd';

    mockSignMessage.mockResolvedValue(longSignature);
    (mockVerifySignature as jest.Mock).mockResolvedValue({
      isValid: true,
      signer: signerAddress,
    });

    render(<MessageSigner />);
    fireEvent.change(screen.getByPlaceholderText(/enter message/i), {
      target: { value: 'Hello World' },
    });
    setTimeout(async () => {
      fireEvent.click(screen.getByText(/sign/i));
      await waitFor(() => {
        expect(mockSignMessage).toHaveBeenCalledWith('Hello World');
        expect(mockVerifySignature).toHaveBeenCalledWith(
          'Hello World',
          longSignature
        );
      });

      const truncatedSig = `${longSignature.slice(0, 10)}...${longSignature.slice(-10)}`;
      const truncatedSigner = `${signerAddress.slice(0, 10)}...${signerAddress.slice(-10)}`;

      expect(screen.getByText(truncatedSig)).toBeInTheDocument();
      expect(screen.getByText(/signature is valid/i)).toBeInTheDocument();
      expect(screen.getByText(truncatedSigner)).toBeInTheDocument();
    });
  });

  it('shows error when wallet is not connected', async () => {
    const mockUseDynamicContext =
      require('@dynamic-labs/sdk-react-core').useDynamicContext;

    mockUseDynamicContext.mockReturnValueOnce({ primaryWallet: null });

    render(<MessageSigner />);
    fireEvent.change(screen.getByPlaceholderText(/enter message/i), {
      target: { value: 'Test' },
    });
    setTimeout(async () => {
      fireEvent.click(screen.getByText(/sign/i));
      await waitFor(() => {
        expect(
          screen.getByText(/wallet not connected or signer not available/i)
        ).toBeInTheDocument();
      });
    });
  });

  it('shows error when signing fails', async () => {
    mockSignMessage.mockRejectedValue(new Error('Signing failed'));

    render(<MessageSigner />);
    fireEvent.change(screen.getByPlaceholderText(/enter message/i), {
      target: { value: 'Broken' },
    });
    setTimeout(async () => {
      fireEvent.click(screen.getByText(/sign/i));
      await waitFor(() => {
        expect(screen.getByText(/signing failed/i)).toBeInTheDocument();
      });
    });
  });

  it('stores signed message in localStorage', async () => {
    const message = 'MyMessage';
    const signature = 'mock-signature';
    mockSignMessage.mockResolvedValue(signature);
    (mockVerifySignature as jest.Mock).mockResolvedValue({
      isValid: true,
      signer: '0xabc',
    });

    render(<MessageSigner />);
    fireEvent.change(screen.getByPlaceholderText(/enter message/i), {
      target: { value: message },
    });
    setTimeout(async () => {
      await waitFor(() => {
        fireEvent.click(screen.getByText(/sign/i));
        const stored = JSON.parse(
          localStorage.getItem('signedMessages') || '[]'
        );
        expect(stored.length).toBe(1);
        expect(stored[0]).toEqual({ message, signature });
      });
    });
  });
});
