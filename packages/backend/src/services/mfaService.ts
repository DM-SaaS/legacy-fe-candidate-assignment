import { authenticator } from 'otplib';
import QRCode from 'qrcode';
import crypto from 'crypto';
import type { TotpSetup, MfaValidationResult } from '../types';

export class MfaService {
  private static readonly ISSUER = 'Dynamic.xyz Wallet';

  // Creates everything needed for TOTP setup - QR code, secret, backup codes
  async generateSetup(userEmail: string): Promise<TotpSetup> {
    try {
      console.log('MfaService: Starting generateSetup for', userEmail);
      
      const secret = authenticator.generateSecret();
      console.log('MfaService: Secret generated');
      
      // Build the standard TOTP URL for authenticator apps
      const otpAuthUrl = authenticator.keyuri(
        userEmail,
        MfaService.ISSUER,
        secret
      );
      console.log('MfaService: OTP Auth URL generated');

      console.log('MfaService: Generating QR code...');
      const qrCodeUrl = await QRCode.toDataURL(otpAuthUrl, {
        errorCorrectionLevel: 'M',
        type: 'image/png',
        margin: 1,
        color: {
          dark: '#000000',
          light: '#FFFFFF'
        },
        width: 256
      });
      console.log('MfaService: QR code generated successfully');

      const backupCodes = this.generateBackupCodes();
      console.log('MfaService: Backup codes generated');

      const result = {
        secret,
        qrCodeUrl,
        manualEntryKey: secret,
        backupCodes
      };
      
      console.log('MfaService: Setup complete');
      return result;
    } catch (error) {
      console.error('MfaService: Error in generateSetup:', error);
      throw new Error(`Failed to generate TOTP setup: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Basic TOTP validation - strict timing
  validateToken(token: string, secret: string): MfaValidationResult {
    try {
      console.log('MfaService: Validating token');
      
      const cleanToken = token.replace(/\s/g, '');
      
      if (!/^\d{6}$/.test(cleanToken)) {
        console.log('MfaService: Invalid token format');
        return {
          isValid: false,
          timestamp: new Date().toISOString()
        };
      }

      const isValid = authenticator.verify({
        token: cleanToken,
        secret: secret
      });
      
      console.log('MfaService: Token validation result:', isValid);
      return {
        isValid,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('TOTP validation error:', error);
      return {
        isValid: false,
        timestamp: new Date().toISOString()
      };
    }
  }

  // More forgiving validation with time window for network delays
  validateTokenWithWindow(token: string, secret: string, windowSize = 1): MfaValidationResult {
    try {
      const cleanToken = token.replace(/\s/g, '');
      
      if (!/^\d{6}$/.test(cleanToken)) {
        return {
          isValid: false,
          timestamp: new Date().toISOString()
        };
      }

      // Temporarily allow codes from previous/next time window
      const originalWindow = authenticator.options.window ?? 1;
      authenticator.options = { ...authenticator.options, window: windowSize };
      
      const isValid = authenticator.verify({
        token: cleanToken,
        secret: secret
      });
      
      authenticator.options = { ...authenticator.options, window: originalWindow };
      
      return {
        isValid,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      console.error('TOTP validation with window error:', error);
      return {
        isValid: false,
        timestamp: new Date().toISOString()
      };
    }
  }

  // Generate random backup codes for account recovery
  private generateBackupCodes(count = 8): string[] {
    const codes: string[] = [];
    
    for (let i = 0; i < count; i++) {
      const randomBytes = crypto.randomBytes(4);
      const code = randomBytes.toString('hex').toUpperCase().substring(0, 8);
      codes.push(code);
    }
    
    return codes;
  }

  static formatSecretForDisplay(secret: string): string {
    return secret.match(/.{1,4}/g)?.join(' ') || secret;
  }

  generateCurrentToken(secret: string): string {
    return authenticator.generate(secret);
  }

  // How many seconds until the current TOTP expires
  static getTimeRemaining(): number {
    const epoch = Math.round(new Date().getTime() / 1000.0);
    const timeStep = 30;
    return timeStep - (epoch % timeStep);
  }
} 