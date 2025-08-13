import { renderWithProviders } from '../test/render';
import MfaView from './MfaView';
import { mockState } from '../test/stubs/dynamicState';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('<MfaView />', () => {
  beforeEach(() => {
    mockState.isLoggedIn = true;
    mockState.userWithMissingInfo = { scope: [] };
    mockState.mfa.getUserDevices.mockResolvedValue([]);
    mockState.mfa.getRecoveryCodes.mockResolvedValue(['CODE-111111', 'CODE-222222']);
  });

  it('disables Add device and shows info when a verified TOTP exists', async () => {
    mockState.mfa.getUserDevices.mockResolvedValueOnce([
      { id: 'd1', isVerified: true, type: 'totp', createdAt: new Date().toISOString(), name: 'Auth App' }
    ]);

    renderWithProviders(<MfaView />);

    await screen.findByText(/Registered devices/i);

    const info = screen.getByRole('alert');
    expect(within(info).getByText(/You already have/i)).toBeInTheDocument();
    expect(within(info).getByText(/verified TOTP/i)).toBeInTheDocument();
    expect(within(info).getByText(/Only one TOTP device is supported/i)).toBeInTheDocument();

    const btn = screen.getByRole('button', { name: /add device/i });
    expect(btn).toBeDisabled();
  });

  it('flows through add device -> QR -> OTP -> backup codes', async () => {
    mockState.mfa.getUserDevices.mockResolvedValueOnce([]);

    renderWithProviders(<MfaView />);

    await screen.findByText(/Registered devices/i);

    await userEvent.click(screen.getByRole('button', { name: /add device/i }));
    await screen.findByText(/Scan this QR code/i);

    await userEvent.click(screen.getByRole('button', { name: /I(’|')ve scanned it/i }));
    await screen.findByText(/Enter the 6-digit code/i);

    await userEvent.type(screen.getByLabelText(/One-time code/i), '123456');
    await userEvent.click(screen.getByRole('button', { name: /Verify/i }));

    await waitFor(() => {
      expect(screen.getByText('CODE-111111')).toBeInTheDocument();
    });
  });

  it('shows error when OTP invalid', async () => {
    mockState.mfa.authenticateDevice.mockRejectedValueOnce(new Error('Invalid code'));
    renderWithProviders(<MfaView />);

    await userEvent.click(await screen.findByRole('button', { name: /add device/i }));

    await screen.findByText(/Scan this QR code/i);

    await userEvent.click(screen.getByRole('button', { name: /scanned it/i }));

    await userEvent.type(screen.getByLabelText(/One-time code/i), '000000');
    await userEvent.click(screen.getByRole('button', { name: /verify/i }));

    await screen.findByText(/Invalid code/i);
  });

});
