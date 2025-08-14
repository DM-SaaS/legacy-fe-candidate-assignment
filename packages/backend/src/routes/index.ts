import { Router } from 'express';
import { SignatureController } from '../controllers/signatureController';
import { MfaController } from '../controllers/mfaController';
import { validateRequest } from '../middleware/validation';
import { asyncHandler } from '../middleware/errorHandler';
import { 
  signatureVerificationSchema,
  mfaSetupSchema,
  mfaValidateTokenSchema,
  mfaValidateTokenWithWindowSchema
} from '../utils/validation';

const router = Router();
const signatureController = new SignatureController();
const mfaController = new MfaController();

// Health check endpoint
router.get('/health', asyncHandler(signatureController.healthCheck));

// Wallet signature verification
router.post(
  '/verify-signature',
  validateRequest(signatureVerificationSchema),
  asyncHandler(signatureController.verifySignature)
);

// MFA endpoints for TOTP setup and validation
router.post(
  '/mfa/setup',
  validateRequest(mfaSetupSchema),
  asyncHandler(mfaController.generateSetup)
);

router.post(
  '/mfa/validate',
  validateRequest(mfaValidateTokenSchema),
  asyncHandler(mfaController.validateToken)
);

router.post(
  '/mfa/validate-with-window',
  validateRequest(mfaValidateTokenWithWindowSchema),
  asyncHandler(mfaController.validateTokenWithWindow)
);

router.get('/mfa/time-remaining', asyncHandler(mfaController.getTimeRemaining));

export default router; 