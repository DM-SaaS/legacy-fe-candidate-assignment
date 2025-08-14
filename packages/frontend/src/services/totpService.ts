import { apiService } from './api';
import type { TotpSetup } from '../types';

export class TotpService {
  // Frontend wrapper for backend TOTP setup generation
  static async generateSetup(userEmail: string): Promise<TotpSetup> {
    try {
      console.log('TotpService: Starting generateSetup for', userEmail);
      console.log('TotpService: API call payload:', { email: userEmail });
      
      const response = await apiService.generateMfaSetup({ email: userEmail });
      console.log('TotpService: API response:', response);
      
      if (!response.success || !response.data) {
        throw new Error(response.error?.message || 'Failed to generate MFA setup');
      }

      console.log('TotpService: Setup generated successfully via backend');
      return response.data;
    } catch (error) {
      console.error('TotpService: Error in generateSetup:', error);
      console.error('TotpService: Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        full: error
      });
      throw new Error(`Failed to generate TOTP setup: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  static async validateToken(token: string, secret: string): Promise<boolean> {
    try {
      console.log('TotpService: Validating token');
      
      const response = await apiService.validateMfaToken({ token, secret });
      
      if (!response.success || !response.data) {
        console.log('TotpService: Token validation failed');
        return false;
      }

      console.log('TotpService: Token validation result:', response.data.isValid);
      return response.data.isValid;
    } catch (error) {
      console.error('TOTP validation error:', error);
      return false;
    }
  }

  // Uses backend's time window validation for better UX
  static async validateTokenWithWindow(token: string, secret: string, windowSize = 1): Promise<boolean> {
    try {
      const response = await apiService.validateMfaTokenWithWindow({ token, secret, windowSize });
      
      if (!response.success || !response.data) {
        return false;
      }

      return response.data.isValid;
    } catch (error) {
      console.error('TOTP validation with window error:', error);
      return false;
    }
  }

  static async getTimeRemaining(): Promise<number> {
    try {
      const response = await apiService.getMfaTimeRemaining();
      
      if (!response.success || !response.data) {
        const epoch = Math.round(new Date().getTime() / 1000.0);
        const timeStep = 30;
        return timeStep - (epoch % timeStep);
      }

      return response.data.timeRemaining;
    } catch (error) {
      console.error('Failed to get time remaining from backend, using local calculation:', error);
      const epoch = Math.round(new Date().getTime() / 1000.0);
      const timeStep = 30;
      return timeStep - (epoch % timeStep);
    }
  }

  static formatSecretForDisplay(secret: string): string {
    return secret.match(/.{1,4}/g)?.join(' ') || secret;
  }
}

export interface TotpStorage {
  saveSecret(userIdentifier: string, secret: string): Promise<void>;
  getSecret(userIdentifier: string): Promise<string | null>;
  removeSecret(userIdentifier: string): Promise<void>;
  saveBackupCodes(userIdentifier: string, codes: string[]): Promise<void>;
  getBackupCodes(userIdentifier: string): Promise<string[]>;
}

// Simple localStorage implementation - should use secure storage in production
export class LocalTotpStorage implements TotpStorage {
  private static readonly SECRET_KEY_PREFIX = 'totp_secret_';
  private static readonly BACKUP_CODES_KEY_PREFIX = 'totp_backup_';

  async saveSecret(userIdentifier: string, secret: string): Promise<void> {
    try {
      console.log('LocalTotpStorage: Saving secret for', userIdentifier);
      localStorage.setItem(`${LocalTotpStorage.SECRET_KEY_PREFIX}${userIdentifier}`, secret);
      console.log('LocalTotpStorage: Secret saved successfully');
    } catch (error) {
      console.error('LocalTotpStorage: Failed to save secret:', error);
      throw error;
    }
  }

  async getSecret(userIdentifier: string): Promise<string | null> {
    try {
      const secret = localStorage.getItem(`${LocalTotpStorage.SECRET_KEY_PREFIX}${userIdentifier}`);
      console.log('LocalTotpStorage: Retrieved secret for', userIdentifier, secret ? 'found' : 'not found');
      return secret;
    } catch (error) {
      console.error('LocalTotpStorage: Failed to get secret:', error);
      return null;
    }
  }

  async removeSecret(userIdentifier: string): Promise<void> {
    try {
      console.log('LocalTotpStorage: Removing secret for', userIdentifier);
      localStorage.removeItem(`${LocalTotpStorage.SECRET_KEY_PREFIX}${userIdentifier}`);
      localStorage.removeItem(`${LocalTotpStorage.BACKUP_CODES_KEY_PREFIX}${userIdentifier}`);
      console.log('LocalTotpStorage: Secret removed successfully');
    } catch (error) {
      console.error('LocalTotpStorage: Failed to remove secret:', error);
      throw error;
    }
  }

  async saveBackupCodes(userIdentifier: string, codes: string[]): Promise<void> {
    try {
      console.log('LocalTotpStorage: Saving backup codes for', userIdentifier);
      localStorage.setItem(`${LocalTotpStorage.BACKUP_CODES_KEY_PREFIX}${userIdentifier}`, JSON.stringify(codes));
      console.log('LocalTotpStorage: Backup codes saved successfully');
    } catch (error) {
      console.error('LocalTotpStorage: Failed to save backup codes:', error);
      throw error;
    }
  }

  async getBackupCodes(userIdentifier: string): Promise<string[]> {
    try {
      const stored = localStorage.getItem(`${LocalTotpStorage.BACKUP_CODES_KEY_PREFIX}${userIdentifier}`);
      const codes = stored ? JSON.parse(stored) : [];
      console.log('LocalTotpStorage: Retrieved backup codes for', userIdentifier, codes.length, 'codes');
      return codes;
    } catch (error) {
      console.error('LocalTotpStorage: Failed to get backup codes:', error);
      return [];
    }
  }


} 