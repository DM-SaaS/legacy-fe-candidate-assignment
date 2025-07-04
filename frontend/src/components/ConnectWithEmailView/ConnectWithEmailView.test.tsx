import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ConnectWithEmailView from './ConnectWithEmailView';

let mockUser: unknown = null;
const connectWithEmailMock = jest.fn().mockResolvedValue(undefined);
const verifyOtpMock = jest.fn().mockResolvedValue(undefined);
const endSessionMock = jest.fn();

jest.mock('@dynamic-labs/sdk-react-core', () => ({
  useConnectWithOtp: () => ({
    connectWithEmail: connectWithEmailMock,
    verifyOneTimePassword: verifyOtpMock,
  }),
  useDynamicContext: () => ({
    user: mockUser,
    primaryWallet: {
      connector: {
        endSession: endSessionMock,
      },
    },
  }),
}));

jest.mock('../MessageSigner/MessageSigner', () => () => (
  <div>Mocked MessageSigner</div>
));

describe('ConnectWithEmailView', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUser = null;
  });

  it('renders email form initially', () => {
    render(<ConnectWithEmailView />);
    expect(
      screen.getByPlaceholderText(/enter your email/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /send otp/i })
    ).toBeInTheDocument();
  });

  it('submits email and shows OTP form', async () => {
    render(<ConnectWithEmailView />);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    const form = emailInput.closest('form');
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(connectWithEmailMock).toHaveBeenCalledWith('test@example.com');
      expect(screen.getByPlaceholderText(/enter otp/i)).toBeInTheDocument();
    });
  });

  it('submits OTP after showing OTP form', async () => {
    render(<ConnectWithEmailView />);
    fireEvent.change(screen.getByPlaceholderText(/enter your email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.submit(
      screen.getByRole('button', { name: /send otp/i }).closest('form')!
    );

    const otpInput = await screen.findByPlaceholderText(/enter otp/i);
    fireEvent.change(otpInput, { target: { value: '123456' } });
    fireEvent.submit(otpInput.closest('form')!);

    await waitFor(() => {
      expect(verifyOtpMock).toHaveBeenCalledWith('123456');
    });
  });

  it('shows authenticated view when user is present', () => {
    mockUser = {
      verifiedCredentials: [{ address: '0x1234567890abcdef' }],
    };

    render(<ConnectWithEmailView />);
    expect(screen.getByText(/authenticated/i)).toBeInTheDocument();
    expect(screen.getByText(/0x1234567890abcdef/i)).toBeInTheDocument();
    expect(screen.getByText(/log out/i)).toBeInTheDocument();
    expect(screen.getByText(/mocked messagesigner/i)).toBeInTheDocument();
  });
});
